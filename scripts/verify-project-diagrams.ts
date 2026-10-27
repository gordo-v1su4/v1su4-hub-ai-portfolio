import { workflowDiagrams } from '../src/variations/editorial/diagramData';
import { readFileSync } from 'node:fs';
type Point = [number,number];
let failures = 0;
for (const [slug,d] of Object.entries(workflowDiagrams)) {
  const html=readFileSync(new URL(`../src/variations/editorial/diagrams/${slug}-workflow.html`,import.meta.url),'utf8');
  const heights=[...html.matchAll(/<rect x="\d+" y="\d+" width="208" height="(\d+)"/g)].map(m=>Number(m[1]));
  const nodeHeight=(id:string)=>heights[d.nodes.findIndex(n=>n[0]===id)];
  const arrowGroup=html.match(/<g fill="none"[^>]*marker-end=[^>]+>([\s\S]*?)<\/g>/)?.[1] ?? '';
  const renderedPaths=[...arrowGroup.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]);
  const fail = (message:string) => { console.error(`${slug}: ${message}`); failures++; };
  if(d.nodes.length>9 || d.paths.length>12 || d.focal.length>2)fail('Complexity budget exceeded');
  if(heights.length!==d.nodes.length || renderedPaths.length!==d.paths.length)fail('Generated geometry does not match source graph');
  for(const node of d.nodes) if(node[3]<0 || node[4]<0 || node[3]+208>1100 || node[4]+nodeHeight(node[0])>d.height)fail(`Node ${node[0]} outside viewBox`);
  for(const [i,path] of renderedPaths.entries()) {
    const tokens=path.match(/[MHVQ]|-?\d+(?:\.\d+)?/g) ?? [];
    let cursor:Point=[0,0]; const points:Point[]=[]; let j=0;
    while(j<tokens.length) {
      const command=tokens[j++];
      if(command==='M') { cursor=[Number(tokens[j++]),Number(tokens[j++])];points.push(cursor); }
      else if(command==='H'||command==='V') {
        const end:Point=command==='H'?[Number(tokens[j++]),cursor[1]]:[cursor[0],Number(tokens[j++])];
        const start=cursor; const n=Math.max(1,Math.ceil(Math.hypot(end[0]-start[0],end[1]-start[1])/2));
        for(let t=1;t<=n;t++)points.push([start[0]+(end[0]-start[0])*t/n,start[1]+(end[1]-start[1])*t/n]); cursor=end;
      } else if(command==='Q') {
        const control:Point=[Number(tokens[j++]),Number(tokens[j++])],end:Point=[Number(tokens[j++]),Number(tokens[j++])],start=cursor;
        for(let n=1;n<=16;n++){const t=n/16;points.push([(1-t)**2*start[0]+2*(1-t)*t*control[0]+t*t*end[0],(1-t)**2*start[1]+2*(1-t)*t*control[1]+t*t*end[1]]);}cursor=end;
      } else throw Error(`Unsupported geometry command ${command}`);
    }
    const endpoints=[points[0],points.at(-1)!];
    const attached=d.nodes.filter(n=>endpoints.some(([x,y])=>x>=n[3]-.1&&x<=n[3]+208.1&&y>=n[4]-.1&&y<=n[4]+nodeHeight(n[0])+.1&&(Math.abs(x-n[3])<.1||Math.abs(x-n[3]-208)<.1||Math.abs(y-n[4])<.1||Math.abs(y-n[4]-nodeHeight(n[0]))<.1)));
    if(attached.length!==2)fail(`Arrow ${i+1} attaches to ${attached.length} nodes`);
    for(const n of d.nodes) if(!attached.includes(n)&&points.some(([x,y])=>x>n[3]+1&&x<n[3]+207&&y>n[4]+1&&y<n[4]+nodeHeight(n[0])-1))fail(`Arrow ${i+1} transits behind ${n[0]}`);
  }
}
if(failures)process.exit(1);
console.log('All workflow arrows attach to two nodes and avoid unrelated node interiors; diagram budgets and bounds pass.');
