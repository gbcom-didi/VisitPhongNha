
import { db } from "./server/db.js";
import { businesses } from "./shared/schema.js";
import { eq } from "drizzle-orm";

async function updateBanhMiAri() {
  try {
    console.log('Updating Bánh mi Ari description...');
    
    // Find the business first
    const existingBusiness = await db.query.businesses.findFirst({
      where: eq(businesses.name, "Bánh mi Ari")
    });
    
    if (!existingBusiness) {
      console.log('Business "Bánh mi Ari" not found');
      return;
    }
    
    console.log('Current description:', existingBusiness.description);
    
    // Update the description
    const newDescription = "I am testing VPN - " + (existingBusiness.description || "Delicious Vietnamese banh mi sandwiches in Phong Nha.");
    
    const [updatedBusiness] = await db
      .update(businesses)
      .set({ 
        description: newDescription,
        updatedAt: new Date() 
      })
      .where(eq(businesses.name, "Bánh mi Ari"))
      .returning();
    
    console.log('✅ Successfully updated Bánh mi Ari');
    console.log('New description:', updatedBusiness.description);
    
  } catch (error) {
    console.error('❌ Error updating business:', error);
  } finally {
    process.exit(0);
  }
}

updateBanhMiAri();
