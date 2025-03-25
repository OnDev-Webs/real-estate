// This is a mock implementation of MongoDB service
// In a real app, you would use the MongoDB driver or an ODM like Mongoose

import { Property } from "@/lib/data";

// Mock MongoDB service
class MockMongoDB {
  private collections: {
    [key: string]: any[];
  } = {
    properties: [],
    users: [],
    offers: [],
    inquiries: []
  };

  constructor() {
    // Initialize with local storage data if available
    const storedProperties = localStorage.getItem('db_properties');
    if (storedProperties) {
      this.collections.properties = JSON.parse(storedProperties);
    }
    
    const storedUsers = localStorage.getItem('db_users');
    if (storedUsers) {
      this.collections.users = JSON.parse(storedUsers);
    }
    
    const storedOffers = localStorage.getItem('db_offers');
    if (storedOffers) {
      this.collections.offers = JSON.parse(storedOffers);
    }
    
    const storedInquiries = localStorage.getItem('db_inquiries');
    if (storedInquiries) {
      this.collections.inquiries = JSON.parse(storedInquiries);
    }
  }

  private saveToLocalStorage(collection: string) {
    localStorage.setItem(`db_${collection}`, JSON.stringify(this.collections[collection]));
  }

  // Find documents in a collection
  async find(collection: string, query: any = {}): Promise<any[]> {
    console.log(`Finding in ${collection} with query:`, query);
    
    if (!this.collections[collection]) {
      return [];
    }
    
    // Very simple query implementation
    return this.collections[collection].filter(doc => {
      for (const key in query) {
        if (query[key] !== doc[key]) {
          return false;
        }
      }
      return true;
    });
  }

  // Find one document
  async findOne(collection: string, query: any): Promise<any | null> {
    const results = await this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  // Find by ID
  async findById(collection: string, id: string): Promise<any | null> {
    return this.findOne(collection, { id });
  }

  // Insert a document
  async insertOne(collection: string, document: any): Promise<{ insertedId: string }> {
    if (!this.collections[collection]) {
      this.collections[collection] = [];
    }
    
    // Ensure document has an ID
    if (!document.id) {
      document.id = `${collection}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    
    // Ensure document has timestamps
    document.createdAt = new Date().toISOString();
    document.updatedAt = new Date().toISOString();
    
    this.collections[collection].push(document);
    this.saveToLocalStorage(collection);
    
    return { insertedId: document.id };
  }

  // Update a document
  async updateOne(collection: string, query: any, update: any): Promise<{ modifiedCount: number }> {
    if (!this.collections[collection]) {
      return { modifiedCount: 0 };
    }
    
    let modifiedCount = 0;
    
    this.collections[collection] = this.collections[collection].map(doc => {
      let matches = true;
      
      // Check if document matches query
      for (const key in query) {
        if (query[key] !== doc[key]) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        modifiedCount++;
        // Update document (simple implementation)
        const updated = { ...doc };
        
        // Handle $set operator
        if (update.$set) {
          for (const key in update.$set) {
            updated[key] = update.$set[key];
          }
        }
        
        // Handle direct updates
        for (const key in update) {
          if (key !== '$set' && key !== '$push' && key !== '$pull') {
            updated[key] = update[key];
          }
        }
        
        updated.updatedAt = new Date().toISOString();
        return updated;
      }
      
      return doc;
    });
    
    this.saveToLocalStorage(collection);
    
    return { modifiedCount };
  }

  // Delete a document
  async deleteOne(collection: string, query: any): Promise<{ deletedCount: number }> {
    if (!this.collections[collection]) {
      return { deletedCount: 0 };
    }
    
    const initialLength = this.collections[collection].length;
    
    this.collections[collection] = this.collections[collection].filter(doc => {
      for (const key in query) {
        if (query[key] !== doc[key]) {
          return true; // Keep this document
        }
      }
      return false; // Remove this document
    });
    
    this.saveToLocalStorage(collection);
    
    const deletedCount = initialLength - this.collections[collection].length;
    return { deletedCount };
  }
}

// Create and export a singleton instance
const db = new MockMongoDB();
export default db;

// Property-specific functions using our mock MongoDB
export const getAllProperties = async () => {
  return await db.find('properties');
};

export const getPropertyById = async (id: string) => {
  return await db.findById('properties', id);
};

export const addProperty = async (property: Omit<Property, 'id' | 'createdAt'>) => {
  return await db.insertOne('properties', property);
};

export const updateProperty = async (id: string, updates: Partial<Property>) => {
  return await db.updateOne('properties', { id }, { $set: updates });
};

export const deleteProperty = async (id: string) => {
  return await db.deleteOne('properties', { id });
};

// In a real app with MongoDB, you would use code like this:
/*
import { MongoClient, ObjectId } from 'mongodb';

const uri = "mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let db;

export const connectToDatabase = async () => {
  if (!db) {
    await client.connect();
    db = client.db('realEstate');
    console.log("Connected to MongoDB!");
  }
  return db;
};

export const getAllProperties = async () => {
  const database = await connectToDatabase();
  return await database.collection('properties').find({}).toArray();
};

export const getPropertyById = async (id) => {
  const database = await connectToDatabase();
  return await database.collection('properties').findOne({ _id: new ObjectId(id) });
};
*/
