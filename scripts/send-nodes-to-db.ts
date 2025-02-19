import { db } from '@/db'
import { nodes } from '@/db/schema'
import nodesData from '@/utils/nodes.json'

async function sendNodesToDb() {
  try {
    for (const node of nodesData) {
      const uuid = crypto.randomUUID()
      await db.insert(nodes).values({
        id: uuid,
        name: node.name,
        type: node.type,
        logo: node.logo,
        slots: node.slots,
        price: 49.99,
      })
    }
    console.log('Data successfully sent to the database.')
  } catch (error) {
    console.error('Error sending data to the database:', error)
  }
}

sendNodesToDb()
