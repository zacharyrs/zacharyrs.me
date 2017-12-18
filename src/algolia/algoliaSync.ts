import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
import * as fetch from 'isomorphic-fetch'
import algoliasearch from  'algoliasearch'

const client_id = process.env.ALGOLIA_APP_ID
const client_secret = process.env.ALGOLIA_API_KEY

const client = algoliasearch(client_id, client_secret)
const index = client.initIndex('blogPosts')

const modelName = 'SyncModel'

export default async (event: FunctionEvent) => {

 const mutation = event.data[modelName].mutation
 const node = event.data[modelName].node
 const previousValues = event.data[modelName].previousValues

 switch (mutation) {
   case 'CREATED':
   return syncAddedNode(node)
   case 'UPDATED':
   return syncUpdatedNode(node)
   case 'DELETED':
   return syncDeletedNode(previousValues)
   default:
   console.log(`mutation was '${mutation}'. Unable to sync node.`)
   return Promise.resolve()
 }
}

function syncAddedNode(node) {
 console.log('Adding node')
 return index.addObject(node)
}

function syncUpdatedNode(node) {
 console.log('Updating node')
 return index.saveObject(node)
}

function syncDeletedNode(node) {
 console.log('Deleting node')
 return index.deleteObject(node.objectID)
}
