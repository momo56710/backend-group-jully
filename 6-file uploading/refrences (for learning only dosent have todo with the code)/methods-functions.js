// Import the User and Product models from modals.js
const { User, Product } = require('./modals');
const mongoose = require('mongoose');

// =================================================================================
// MONGOOSE METHODS AND FUNCTIONS - BEGINNER'S COMPLETE GUIDE
// =================================================================================

console.log('='.repeat(80));
console.log('MONGOOSE METHODS AND FUNCTIONS WITH VALIDATORS');
console.log('='.repeat(80));

// =================================================================================
// 1. CREATE OPERATIONS (C in CRUD)
// =================================================================================

async function createOperations() {
  console.log('\n📝 CREATE OPERATIONS\n' + '-'.repeat(50));
  
  try {
    // ===============================
    // Method 1: Using new Model() + save()
    // ===============================
    console.log('🔹 Method 1: Using new Model() + save()');
    
    const newUser = new User({
      name: 'john doe',           // Will be converted to lowercase due to schema
      email: 'JOHN@EXAMPLE.COM',  // Will be converted to lowercase and trimmed
      username: 'johndoe123',
      age: 25,
      birthDate: new Date('1998-05-15'),
      role: 'user',               // From enum values
      address: {
        street: '  123 Main St  ', // Will be trimmed
        city: 'New York',
        zipCode: '10001',
        country: 'usa'            // Will be converted to uppercase
      },
      hobbies: ['reading', 'gaming'],
      socialMedia: [{
        platform: 'twitter',
        url: 'https://twitter.com/johndoe',
        isPublic: true
      }]
    });

    // Save the document - this triggers validators
    const savedUser = await newUser.save();
    console.log('✅ User created with save():', savedUser.name);
    console.log('   Email (lowercased):', savedUser.email);
    console.log('   Country (uppercased):', savedUser.address.country);

  } catch (error) {
    console.log('❌ Validation Error:', error.message);
  }

  try {
    // ===============================
    // Method 2: Using Model.create()
    // ===============================
    console.log('\n🔹 Method 2: Using Model.create()');
    
    const createdUser = await User.create({
      name: 'jane smith',
      email: 'jane@example.com',
      username: 'janesmith',
      age: 30,
      birthDate: new Date('1993-08-20'),
      role: 'admin',
      address: {
        street: '456 Oak Ave',
        city: 'Boston',
        zipCode: '02101',
        country: 'usa'
      },
      hobbies: ['photography', 'travel', 'cooking']
    });

    console.log('✅ User created with create():', createdUser.name);

  } catch (error) {
    console.log('❌ Creation Error:', error.message);
  }

  try {
    // ===============================
    // Method 3: Using Model.insertMany()
    // ===============================
    console.log('\n🔹 Method 3: Using Model.insertMany()');
    
    const multipleUsers = await User.insertMany([
      {
        name: 'alice johnson',
        email: 'alice@example.com',
        username: 'alicej',
        age: 28,
        birthDate: new Date('1995-03-10'),
        address: {
          street: '789 Pine St',
          city: 'Chicago',
          zipCode: '60601',
          country: 'usa'
        }
      },
      {
        name: 'bob wilson',
        email: 'bob@example.com',
        username: 'bobw',
        age: 35,
        birthDate: new Date('1988-11-25'),
        address: {
          street: '321 Elm St',
          city: 'Miami',
          zipCode: '33101',
          country: 'usa'
        }
      }
    ]);

    console.log('✅ Multiple users created:', multipleUsers.length);

  } catch (error) {
    console.log('❌ Bulk Insert Error:', error.message);
  }

  // ===============================
  // Demonstrating Validation Failures
  // ===============================
  console.log('\n🔹 Demonstrating Validation Failures');
  
  try {
    // This will fail due to invalid email
    await User.create({
      name: 'invalid user',
      email: 'invalid-email',  // Invalid email format
      username: 'invalid',
      age: 25,
      birthDate: new Date('1998-05-15'),
      address: {
        street: '123 Test St',
        city: 'Test City',
        zipCode: '12345',
        country: 'usa'
      }
    });
  } catch (error) {
    console.log('❌ Expected validation error:', error.message);
  }

  try {
    // This will fail due to age being too young
    await User.create({
      name: 'young user',
      email: 'young@example.com',
      username: 'younguser',
      age: 10,  // Too young (min age is 13)
      birthDate: new Date('2013-05-15'),
      address: {
        street: '123 Test St',
        city: 'Test City',
        zipCode: '12345',
        country: 'usa'
      }
    });
  } catch (error) {
    console.log('❌ Expected age validation error:', error.message);
  }
}

// =================================================================================
// 2. READ OPERATIONS (R in CRUD)
// =================================================================================

async function readOperations() {
  console.log('\n📖 READ OPERATIONS\n' + '-'.repeat(50));

  try {
    // ===============================
    // Method 1: Model.find() - Find all documents
    // ===============================
    console.log('🔹 Method 1: Model.find() - Find all documents');
    
    const allUsers = await User.find();
    console.log('✅ Total users found:', allUsers.length);

    // ===============================
    // Method 2: Model.find() with conditions
    // ===============================
    console.log('\n🔹 Method 2: Model.find() with conditions');
    
    const activeUsers = await User.find({ isActive: true });
    console.log('✅ Active users:', activeUsers.length);

    const adminUsers = await User.find({ role: 'admin' });
    console.log('✅ Admin users:', adminUsers.length);

    // ===============================
    // Method 3: Model.findOne() - Find single document
    // ===============================
    console.log('\n🔹 Method 3: Model.findOne()');
    
    const oneUser = await User.findOne({ role: 'admin' });
    if (oneUser) {
      console.log('✅ Found admin user:', oneUser.name);
    }

    // ===============================
    // Method 4: Model.findById() - Find by ID
    // ===============================
    console.log('\n🔹 Method 4: Model.findById()');
    
    if (allUsers.length > 0) {
      const userById = await User.findById(allUsers[0]._id);
      console.log('✅ Found user by ID:', userById.name);
    }

    // ===============================
    // Method 5: Using query conditions with operators
    // ===============================
    console.log('\n🔹 Method 5: Query with operators');
    
    // Find users older than 25
    const olderUsers = await User.find({ age: { $gt: 25 } });
    console.log('✅ Users older than 25:', olderUsers.length);

    // Find users with age between 20 and 35
    const ageRangeUsers = await User.find({ 
      age: { $gte: 20, $lte: 35 } 
    });
    console.log('✅ Users aged 20-35:', ageRangeUsers.length);

    // Find users by multiple conditions (AND)
    const specificUsers = await User.find({
      role: 'user',
      isActive: true,
      age: { $gte: 25 }
    });
    console.log('✅ Active users (25+):', specificUsers.length);

    // Find users by OR conditions
    const orUsers = await User.find({
      $or: [
        { role: 'admin' },
        { role: 'moderator' }
      ]
    });
    console.log('✅ Admin or Moderator users:', orUsers.length);

    // ===============================
    // Method 6: Using select() to choose fields
    // ===============================
    console.log('\n🔹 Method 6: Using select() for specific fields');
    
    const usersNameEmail = await User.find()
      .select('name email role -_id');  // Include name, email, role but exclude _id
    console.log('✅ Users with selected fields:', usersNameEmail.length);
    if (usersNameEmail.length > 0) {
      console.log('   First user:', usersNameEmail[0]);
    }

    // ===============================
    // Method 7: Using sort(), limit(), and skip()
    // ===============================
    console.log('\n🔹 Method 7: Using sort(), limit(), and skip()');
    
    // Sort by age (ascending) and limit to 2 results
    const sortedUsers = await User.find()
      .sort({ age: 1 })     // 1 for ascending, -1 for descending
      .limit(2);
    console.log('✅ Youngest 2 users:');
    sortedUsers.forEach(user => {
      console.log(`   ${user.name} - Age: ${user.age}`);
    });

    // Pagination example: skip first 2, take next 2
    const paginatedUsers = await User.find()
      .sort({ name: 1 })
      .skip(2)
      .limit(2);
    console.log('✅ Paginated users (skip 2, take 2):', paginatedUsers.length);

    // ===============================
    // Method 8: Using populate() for references
    // ===============================
    console.log('\n🔹 Method 8: Using populate() for references');
    
    // Note: This would work if we had actual Department documents
    const usersWithDepartment = await User.find()
      .populate('department')  // Populate the department reference
      .limit(1);
    console.log('✅ Users with populated department:', usersWithDepartment.length);

    // ===============================
    // Method 9: Using custom static methods
    // ===============================
    console.log('\n🔹 Method 9: Using custom static methods');
    
    const adminUsersCustom = await User.findByRole('admin');
    console.log('✅ Admin users (using custom static method):', adminUsersCustom.length);

    const activeUsersCustom = await User.findActiveUsers();
    console.log('✅ Active users (using custom static method):', activeUsersCustom.length);

  } catch (error) {
    console.log('❌ Read Error:', error.message);
  }
}

// =================================================================================
// 3. UPDATE OPERATIONS (U in CRUD)
// =================================================================================

async function updateOperations() {
  console.log('\n✏️ UPDATE OPERATIONS\n' + '-'.repeat(50));

  try {
    // ===============================
    // Method 1: Model.updateOne() - Update single document
    // ===============================
    console.log('🔹 Method 1: Model.updateOne()');
    
    const updateResult = await User.updateOne(
      { name: 'john doe' },           // Filter
      { 
        $set: { 
          salary: 50000,
          lastLogin: new Date()
        }
      }                               // Update
    );
    console.log('✅ Update result:', updateResult);

    // ===============================
    // Method 2: Model.updateMany() - Update multiple documents
    // ===============================
    console.log('\n🔹 Method 2: Model.updateMany()');
    
    const updateManyResult = await User.updateMany(
      { role: 'user' },               // Filter: all users with role 'user'
      { 
        $set: { isVerified: true }    // Update: set verified to true
      }
    );
    console.log('✅ Update many result:', updateManyResult);

    // ===============================
    // Method 3: Model.findByIdAndUpdate()
    // ===============================
    console.log('\n🔹 Method 3: Model.findByIdAndUpdate()');
    
    const user = await User.findOne({ name: 'jane smith' });
    if (user) {
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { 
          $set: { 
            salary: 75000,
            role: 'moderator'
          }
        },
        { 
          new: true,        // Return updated document
          runValidators: true // Run schema validators
        }
      );
      console.log('✅ Updated user:', updatedUser.name, '- New role:', updatedUser.role);
    }

    // ===============================
    // Method 4: Model.findOneAndUpdate()
    // ===============================
    console.log('\n🔹 Method 4: Model.findOneAndUpdate()');
    
    const updatedUserByEmail = await User.findOneAndUpdate(
      { email: 'alice@example.com' },
      { 
        $set: { 
          age: 29,
          salary: 60000
        },
        $push: { 
          hobbies: 'swimming'         // Add to array
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (updatedUserByEmail) {
      console.log('✅ Updated user by email:', updatedUserByEmail.name);
      console.log('   New hobbies:', updatedUserByEmail.hobbies);
    }

    // ===============================
    // Method 5: Document.save() after modification
    // ===============================
    console.log('\n🔹 Method 5: Document.save() after modification');
    
    const userToModify = await User.findOne({ name: 'bob wilson' });
    if (userToModify) {
      userToModify.age = 36;
      userToModify.salary = 80000;
      userToModify.hobbies.push('hiking');
      
      const savedUser = await userToModify.save(); // This triggers validators
      console.log('✅ Modified and saved user:', savedUser.name);
      console.log('   New age:', savedUser.age);
    }

    // ===============================
    // Method 6: Using update operators
    // ===============================
    console.log('\n🔹 Method 6: Using update operators');
    
    // Increment age by 1
    await User.updateOne(
      { name: 'alice johnson' },
      { $inc: { age: 1 } }  // Increment operator
    );
    console.log('✅ Incremented age');

    // Add to array if not exists
    await User.updateOne(
      { name: 'alice johnson' },
      { $addToSet: { hobbies: 'reading' } }  // Add only if not exists
    );
    console.log('✅ Added hobby (if not exists)');

    // Remove from array
    await User.updateOne(
      { name: 'alice johnson' },
      { $pull: { hobbies: 'swimming' } }  // Remove from array
    );
    console.log('✅ Removed hobby');

    // ===============================
    // Method 7: Demonstrating validation during update
    // ===============================
    console.log('\n🔹 Method 7: Update validation example');
    
    try {
      // This should fail due to age validation
      await User.findOneAndUpdate(
        { name: 'john doe' },
        { $set: { age: 5 } },  // Too young (min age is 13)
        { runValidators: true }
      );
    } catch (error) {
      console.log('❌ Expected validation error during update:', error.message);
    }

  } catch (error) {
    console.log('❌ Update Error:', error.message);
  }
}

// =================================================================================
// 4. DELETE OPERATIONS (D in CRUD)
// =================================================================================

async function deleteOperations() {
  console.log('\n🗑️ DELETE OPERATIONS\n' + '-'.repeat(50));

  try {
    // ===============================
    // Method 1: Model.deleteOne() - Delete single document
    // ===============================
    console.log('🔹 Method 1: Model.deleteOne()');
    
    const deleteResult = await User.deleteOne({ name: 'alice johnson' });
    console.log('✅ Delete result:', deleteResult);

    // ===============================
    // Method 2: Model.deleteMany() - Delete multiple documents
    // ===============================
    console.log('\n🔹 Method 2: Model.deleteMany()');
    
    // Create some test users first for deletion
    await User.insertMany([
      {
        name: 'test user 1',
        email: 'test1@example.com',
        username: 'test1',
        age: 25,
        birthDate: new Date('1998-01-01'),
        address: { street: 'Test St', city: 'Test City', zipCode: '12345', country: 'USA' }
      },
      {
        name: 'test user 2',
        email: 'test2@example.com',
        username: 'test2',
        age: 26,
        birthDate: new Date('1997-01-01'),
        address: { street: 'Test St', city: 'Test City', zipCode: '12345', country: 'USA' }
      }
    ]);

    const deleteManyResult = await User.deleteMany({ 
      name: { $regex: /^test user/ }  // Delete users whose name starts with "test user"
    });
    console.log('✅ Delete many result:', deleteManyResult);

    // ===============================
    // Method 3: Model.findByIdAndDelete()
    // ===============================
    console.log('\n🔹 Method 3: Model.findByIdAndDelete()');
    
    const userToDelete = await User.findOne({ name: 'bob wilson' });
    if (userToDelete) {
      const deletedUser = await User.findByIdAndDelete(userToDelete._id);
      console.log('✅ Deleted user by ID:', deletedUser.name);
    }

    // ===============================
    // Method 4: Model.findOneAndDelete()
    // ===============================
    console.log('\n🔹 Method 4: Model.findOneAndDelete()');
    
    const deletedUserByEmail = await User.findOneAndDelete({ 
      email: 'jane@example.com' 
    });
    
    if (deletedUserByEmail) {
      console.log('✅ Deleted user by email:', deletedUserByEmail.name);
    }

    // ===============================
    // Method 5: Document.remove() (deprecated but still works)
    // ===============================
    console.log('\n🔹 Method 5: Document.deleteOne()');
    
    const userToRemove = await User.findOne({ name: 'john doe' });
    if (userToRemove) {
      await userToRemove.deleteOne();  // New way (remove() is deprecated)
      console.log('✅ User removed using document method');
    }

  } catch (error) {
    console.log('❌ Delete Error:', error.message);
  }
}

// =================================================================================
// 5. AGGREGATION OPERATIONS
// =================================================================================

async function aggregationOperations() {
  console.log('\n📊 AGGREGATION OPERATIONS\n' + '-'.repeat(50));

  try {
    // Create some sample data for aggregation
    await User.insertMany([
      {
        name: 'agg user 1',
        email: 'agg1@example.com',
        username: 'agg1',
        age: 25,
        salary: 50000,
        role: 'user',
        birthDate: new Date('1998-01-01'),
        address: { street: 'Agg St', city: 'New York', zipCode: '10001', country: 'USA' }
      },
      {
        name: 'agg user 2',
        email: 'agg2@example.com',
        username: 'agg2',
        age: 30,
        salary: 75000,
        role: 'admin',
        birthDate: new Date('1993-01-01'),
        address: { street: 'Agg St', city: 'Boston', zipCode: '02101', country: 'USA' }
      },
      {
        name: 'agg user 3',
        email: 'agg3@example.com',
        username: 'agg3',
        age: 35,
        salary: 90000,
        role: 'user',
        birthDate: new Date('1988-01-01'),
        address: { street: 'Agg St', city: 'New York', zipCode: '10002', country: 'USA' }
      }
    ]);

    // ===============================
    // Method 1: Model.aggregate() - Basic aggregation
    // ===============================
    console.log('🔹 Method 1: Basic aggregation - Average age');
    
    const avgAge = await User.aggregate([
      { $group: { _id: null, averageAge: { $avg: '$age' } } }
    ]);
    console.log('✅ Average age:', avgAge[0]?.averageAge);

    // ===============================
    // Method 2: Group by role
    // ===============================
    console.log('\n🔹 Method 2: Group by role');
    
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary' },
          maxAge: { $max: '$age' },
          minAge: { $min: '$age' }
        }
      }
    ]);
    console.log('✅ Role statistics:', roleStats);

    // ===============================
    // Method 3: Match and project
    // ===============================
    console.log('\n🔹 Method 3: Match and project');
    
    const usersByCity = await User.aggregate([
      { $match: { 'address.city': 'New York' } },  // Filter
      { 
        $project: {                                 // Select fields
          name: 1,
          email: 1,
          city: '$address.city',
          _id: 0
        }
      }
    ]);
    console.log('✅ New York users:', usersByCity);

    // ===============================
    // Method 4: Model.countDocuments()
    // ===============================
    console.log('\n🔹 Method 4: Count documents');
    
    const totalUsers = await User.countDocuments();
    console.log('✅ Total users:', totalUsers);

    const activeUsersCount = await User.countDocuments({ isActive: true });
    console.log('✅ Active users count:', activeUsersCount);

    // ===============================
    // Method 5: Model.distinct()
    // ===============================
    console.log('\n🔹 Method 5: Distinct values');
    
    const uniqueRoles = await User.distinct('role');
    console.log('✅ Unique roles:', uniqueRoles);

    const uniqueCities = await User.distinct('address.city');
    console.log('✅ Unique cities:', uniqueCities);

  } catch (error) {
    console.log('❌ Aggregation Error:', error.message);
  }
}

// =================================================================================
// 6. VALIDATION AND MIDDLEWARE DEMONSTRATIONS
// =================================================================================

async function validationAndMiddleware() {
  console.log('\n🛡️ VALIDATION AND MIDDLEWARE\n' + '-'.repeat(50));

  try {
    // ===============================
    // Method 1: Manual validation using validate()
    // ===============================
    console.log('🔹 Method 1: Manual validation');
    
    const testUser = new User({
      name: 'validation test',
      email: 'invalid-email',  // This will fail validation
      username: 'valtest',
      age: 25,
      birthDate: new Date('1998-01-01'),
      address: {
        street: 'Test St',
        city: 'Test City',
        zipCode: '12345',
        country: 'USA'
      }
    });

    try {
      await testUser.validate();
      console.log('✅ Validation passed');
    } catch (error) {
      console.log('❌ Manual validation failed:', error.message);
    }

    // ===============================
    // Method 2: Using instance methods
    // ===============================
    console.log('\n🔹 Method 2: Using instance methods');
    
    const validUser = new User({
      name: 'method test',
      email: 'method@example.com',
      username: 'methodtest',
      age: 25,
      birthDate: new Date('1998-01-01'),
      role: 'admin',
      address: {
        street: 'Method St',
        city: 'Method City',
        zipCode: '12345',
        country: 'USA'
      }
    });

    console.log('✅ Full info:', validUser.getFullInfo());
    console.log('✅ Is adult:', validUser.isAdult());

    // ===============================
    // Method 3: Using virtual properties
    // ===============================
    console.log('\n🔹 Method 3: Using virtual properties');
    
    console.log('✅ Calculated age:', validUser.calculatedAge);
    console.log('✅ Full address:', validUser.fullAddress);

    // Save to trigger middleware
    await validUser.save();

  } catch (error) {
    console.log('❌ Validation/Middleware Error:', error.message);
  }
}

// =================================================================================
// 7. ADVANCED QUERY METHODS
// =================================================================================

async function advancedQueries() {
  console.log('\n🔍 ADVANCED QUERY METHODS\n' + '-'.repeat(50));

  try {
    // ===============================
    // Method 1: Using query builders
    // ===============================
    console.log('🔹 Method 1: Query builders');
    
    const queryBuilderResult = await User
      .find()
      .where('age').gte(25)
      .where('role').in(['user', 'admin'])
      .select('name email age role')
      .sort({ age: -1 })
      .limit(3);
    
    console.log('✅ Query builder result:', queryBuilderResult.length);

    // ===============================
    // Method 2: Text search (if text index exists)
    // ===============================
    console.log('\n🔹 Method 2: Text search');
    
    const textSearchResult = await User.find({
      $text: { $search: 'agg' }
    });
    console.log('✅ Text search result:', textSearchResult.length);

    // ===============================
    // Method 3: Regex search
    // ===============================
    console.log('\n🔹 Method 3: Regex search');
    
    const regexResult = await User.find({
      name: { $regex: /^agg/, $options: 'i' }  // Case insensitive
    });
    console.log('✅ Regex search result:', regexResult.length);

    // ===============================
    // Method 4: Complex nested queries
    // ===============================
    console.log('\n🔹 Method 4: Complex nested queries');
    
    const nestedQuery = await User.find({
      'address.city': 'New York',
      'socialMedia.platform': 'twitter'
    });
    console.log('✅ Nested query result:', nestedQuery.length);

    // ===============================
    // Method 5: Using explain() for query performance
    // ===============================
    console.log('\n🔹 Method 5: Query explanation');
    
    const explanation = await User.find({ role: 'admin' }).explain();
    console.log('✅ Query explanation available (check executionStats)');

  } catch (error) {
    console.log('❌ Advanced Query Error:', error.message);
  }
}

// =================================================================================
// 8. ERROR HANDLING AND BEST PRACTICES
// =================================================================================

async function errorHandlingExamples() {
  console.log('\n⚠️ ERROR HANDLING EXAMPLES\n' + '-'.repeat(50));

  // ===============================
  // Method 1: Handling validation errors
  // ===============================
  console.log('🔹 Method 1: Validation error handling');
  
  try {
    await User.create({
      name: '',  // Empty name (violates minlength)
      email: 'invalid',  // Invalid email
      username: '12',  // Too short username
      age: 5,  // Too young
      birthDate: new Date('2030-01-01'),  // Future date
      address: {
        street: 'Test St',
        city: 'Test City',
        zipCode: '123',  // Invalid zip (not 5 digits)
        country: 'USA'
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.log('❌ Validation errors:');
      for (let field in error.errors) {
        console.log(`   ${field}: ${error.errors[field].message}`);
      }
    }
  }

  // ===============================
  // Method 2: Handling duplicate key errors
  // ===============================
  console.log('\n🔹 Method 2: Duplicate key error handling');
  
  try {
    // First, create a user
    await User.create({
      name: 'duplicate test',
      email: 'duplicate@example.com',
      username: 'duplicatetest',
      age: 25,
      birthDate: new Date('1998-01-01'),
      address: {
        street: 'Duplicate St',
        city: 'Duplicate City',
        zipCode: '12345',
        country: 'USA'
      }
    });

    // Try to create another user with same email (should fail)
    await User.create({
      name: 'another duplicate',
      email: 'duplicate@example.com',  // Same email
      username: 'anotherdupe',
      age: 30,
      birthDate: new Date('1993-01-01'),
      address: {
        street: 'Another St',
        city: 'Another City',
        zipCode: '54321',
        country: 'USA'
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      console.log('❌ Duplicate key error:', error.message);
      console.log('   Duplicate field:', Object.keys(error.keyPattern)[0]);
    }
  }

  // ===============================
  // Method 3: Handling cast errors
  // ===============================
  console.log('\n🔹 Method 3: Cast error handling');
  
  try {
    // Try to find by invalid ObjectId
    await User.findById('invalid-id');
  } catch (error) {
    if (error.name === 'CastError') {
      console.log('❌ Cast error:', error.message);
    }
  }
}

// =================================================================================
// 9. UTILITY METHODS
// =================================================================================

async function utilityMethods() {
  console.log('\n🛠️ UTILITY METHODS\n' + '-'.repeat(50));

  try {
    // ===============================
    // Method 1: Model.exists()
    // ===============================
    console.log('🔹 Method 1: Check if document exists');
    
    const userExists = await User.exists({ email: 'duplicate@example.com' });
    console.log('✅ User exists:', !!userExists);

    // ===============================
    // Method 2: Model.estimatedDocumentCount()
    // ===============================
    console.log('\n🔹 Method 2: Estimated document count');
    
    const estimatedCount = await User.estimatedDocumentCount();
    console.log('✅ Estimated document count:', estimatedCount);

    // ===============================
    // Method 3: Model.watch() for change streams
    // ===============================
    console.log('\n🔹 Method 3: Change streams (watch)');
    
    // Note: This requires a replica set in MongoDB
    try {
      const changeStream = User.watch();
      console.log('✅ Change stream created (requires replica set)');
      changeStream.close(); // Close immediately for demo
    } catch (error) {
      console.log('ℹ️ Change streams require MongoDB replica set');
    }

    // ===============================
    // Method 4: Model.hydrate()
    // ===============================
    console.log('\n🔹 Method 4: Hydrate plain object to document');
    
    const plainObject = {
      name: 'hydrated user',
      email: 'hydrated@example.com',
      username: 'hydrated',
      age: 28,
      role: 'user'
    };

    const hydratedDoc = User.hydrate(plainObject);
    console.log('✅ Hydrated document:', hydratedDoc.getFullInfo());

  } catch (error) {
    console.log('❌ Utility Method Error:', error.message);
  }
}

// =================================================================================
// 10. MAIN EXECUTION FUNCTION
// =================================================================================

async function demonstrateAllMethods() {
  console.log('🚀 Starting Mongoose Methods Demonstration...\n');
  
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect('mongodb://localhost:27017/mongoose-demo', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data for clean demo
    await User.deleteMany({});
    console.log('🧹 Cleared existing data\n');

    // Run all demonstrations
    await createOperations();
    await readOperations();
    await updateOperations();
    await deleteOperations();
    await aggregationOperations();
    await validationAndMiddleware();
    await advancedQueries();
    await errorHandlingExamples();
    await utilityMethods();

    console.log('\n🎉 All methods demonstrated successfully!');

  } catch (error) {
    console.error('❌ Demo Error:', error.message);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔒 MongoDB connection closed');
  }
}

// =================================================================================
// EXPORT FOR USE IN OTHER FILES
// =================================================================================

module.exports = {
  createOperations,
  readOperations,
  updateOperations,
  deleteOperations,
  aggregationOperations,
  validationAndMiddleware,
  advancedQueries,
  errorHandlingExamples,
  utilityMethods,
  demonstrateAllMethods
};

// =================================================================================
// QUICK REFERENCE SUMMARY
// =================================================================================

/*
📚 MONGOOSE METHODS QUICK REFERENCE:

CREATE:
- new Model() + save()
- Model.create()
- Model.insertMany()

READ:
- Model.find()
- Model.findOne()
- Model.findById()
- Model.exists()
- Model.countDocuments()
- Model.distinct()
- Model.aggregate()

UPDATE:
- Model.updateOne()
- Model.updateMany()
- Model.findByIdAndUpdate()
- Model.findOneAndUpdate()
- document.save()

DELETE:
- Model.deleteOne()
- Model.deleteMany()
- Model.findByIdAndDelete()
- Model.findOneAndDelete()
- document.deleteOne()

QUERY OPERATORS:
- $gt, $gte, $lt, $lte (comparison)
- $in, $nin (inclusion)
- $and, $or, $nor (logical)
- $regex (pattern matching)
- $text (text search)
- $inc, $set, $push, $pull (update operators)

VALIDATION:
- Automatic on save/create
- Manual with validate()
- Custom validators
- Built-in validators (required, min, max, etc.)

MIDDLEWARE:
- pre('save'), post('save')
- pre('remove'), post('remove')
- pre('validate'), post('validate')

VIRTUALS:
- Computed properties
- Not stored in database
- Getter and setter functions
*/

// Uncomment the line below to run the demonstration
// demonstrateAllMethods();