import { House, type LucideIcon, Workflow } from 'lucide-react'

const links: {
  label: string;
  url: string;
  icon: any;
  subLinks?: {
    label: string;
    url: string;
    icon: any;
  }[];
}[] = [
  {
    label: 'Dashboard',
    url: '/',
    icon: House,
  },
  {
    label: 'Active Nodes',
    url: '/active-nodes',
    icon: Workflow,
  },
  {
    label: "NodezPad",
    url: "/nodezpad",
    icon: Workflow,
    subLinks: [
      {
        label: "NodezPad Form",
        url: "/nodezpad/nodeform",
        icon: Workflow,
      },
      {
        label: "Node Details",
        url: "/nodezpad/[nodeId]",
        icon: Workflow,
      },
    ],
  },
];

export default links
