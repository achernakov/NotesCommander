import json
import pymongo
from bson.objectid import ObjectId
import datetime

class Handler:


    def PrepareDB (self):
        self.m_client = pymongo.MongoClient('mongodb://localhost:27017/')
        self.m_db = self.m_client[self.m_dbName]
        self.m_collection = self.m_db[self.m_mainCollectionName]


    def __init__(self):

        self.m_dbName = 'NotesCommander'
        self.m_mainCollectionName = 'Notes'

        self.HandlingTable = {
            'saveDocument': self.SaveDocument,
            'loadDocument': self.LoadDocument,
            'getDocuments': self.GetDocuments,
            'deleteDocument': self.DeleteDocument
        }

        self.PrepareDB()

        return

    def DeleteDocument(self, req):
        self.m_collection.remove(ObjectId(req['id']));
        return {'status': 'success'}

    def SaveDocument(self, req):
        doc = req['doc']
        docName = req['name']
        if 'id' in req:
            docId = req['id']
            self.m_collection.update({'_id': ObjectId(docId)},
                                     {'$set': {'doc': doc, 'name': docName, 'datetime': datetime.datetime.now()}})
        else:
            self.m_collection.insert({'doc': doc, 'name': docName, 'datetime': datetime.datetime.now()})
        return {'status': 'success'}

    def LoadDocument(self, req):
        docId = req['id']['$oid']
        print (docId)
        res = self.m_collection.find_one({'_id': ObjectId(docId)})
        print(res)
        res['status'] = 'success'
        res['_id'] = str(res['_id'])
        res['datetime'] = str(res['datetime'])
        return res

    def HandleRequest (self, req):
        reqtype = req['reqtype']
        if reqtype in self.HandlingTable:
            return self.HandlingTable[reqtype](req)
        else:
            return {'status': 'failure', 'description': 'Failed to dispatch message'}


    def GetDocuments (self, req):
        resp = {};
        resp['status'] = 'success'
        cur = self.m_collection.find({}, {'name': True})
        resp['docs'] = []
        for item in cur:
            print ('{0}: {1}'.format(str(item['_id']), item['name']))
            resp['docs'].append({'name': item['name'], 'id': str(item['_id'])})
        return resp