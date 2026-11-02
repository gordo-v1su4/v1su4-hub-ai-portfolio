import type { BuildNode } from './caseStudies';

export type StackLayer = {
  role: string;
  name: string;
  detail: string;
  accent?: boolean;
  pending?: boolean;
};

export function architectureToStackLayers(nodes: BuildNode[]): StackLayer[] {
  return nodes.map((node) => ({
    role: node.role.split('·')[0]?.trim() ?? node.role,
    name: node.name,
    detail: node.parts.slice(0, 3).join(' · ') || node.body.split('.')[0] || node.body,
    accent: node.accent ?? /trigger\.dev/i.test(node.name),
    pending: node.pending,
  }));
}
