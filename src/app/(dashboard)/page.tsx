import { getNodes } from "@/app/actions/nodes";
import NodeCard from "@/components/layouts/node-card";

export default async function HomePage() {
  const nodes = await getNodes()
  return (
    <section className="grid gap-6 py-4 md:grid-cols-2 lg:grid-cols-3">
      {nodes?.map((node) => (
        <NodeCard key={node.id} node={node} />
      ))}
    </section>
  )
}
