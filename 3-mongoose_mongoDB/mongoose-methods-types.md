# Mongoose Methods & Types Guide

## 📋 Table of Contents
- [Connection Methods](#connection-methods)
- [Schema Types](#schema-types)
- [Model Methods](#model-methods)
- [Query Methods](#query-methods)
- [Document Methods](#document-methods)
- [Middleware](#middleware)

---

## 🔌 Connection Methods

### `mongoose.connect()`
**English**: Connects to MongoDB database using connection string
**Français**: Se connecte à la base de données MongoDB en utilisant une chaîne de connexion
**العربية**: يتصل بقاعدة بيانات MongoDB باستخدام سلسلة الاتصال

```javascript
mongoose.connect(process.env.MONGO_URI);
```

### `mongoose.connection.on()`
**English**: Listens for connection events (connected, error, disconnected)
**Français**: Écoute les événements de connexion (connecté, erreur, déconnecté)
**العربية**: يستمع لأحداث الاتصال (متصل، خطأ، منفصل)

```javascript
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
```

---

## 📝 Schema Types

### `String`
**English**: Defines a string field in the schema
**Français**: Définit un champ de type chaîne dans le schéma
**العربية**: يحدد حقل نصي في المخطط

```javascript
{ type: String, required: true, unique: true }
```

### `Number`
**English**: Defines a numeric field in the schema
**Français**: Définit un champ numérique dans le schéma
**العربية**: يحدد حقل رقمي في المخطط

```javascript
{ type: Number, min: 0, max: 100 }
```

### `Date`
**English**: Defines a date field with default current timestamp
**Français**: Définit un champ de date avec l'horodatage actuel par défaut
**العربية**: يحدد حقل تاريخ مع الطابع الزمني الحالي كافتراضي

```javascript
{ type: Date, default: Date.now }
```

### `ObjectId`
**English**: References another document in the database
**Français**: Référence un autre document dans la base de données
**العربية**: يشير إلى مستند آخر في قاعدة البيانات

```javascript
{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
```

### `Boolean`
**English**: Defines a true/false field
**Français**: Définit un champ vrai/faux
**العربية**: يحدد حقل صحيح/خطأ

```javascript
{ type: Boolean, default: false }
```

### `Array`
**English**: Defines an array field
**Français**: Définit un champ de tableau
**العربية**: يحدد حقل مصفوفة

```javascript
{ type: [String] }
```

---

## 🏗️ Model Methods

### `mongoose.model()`
**English**: Creates a model from schema
**Français**: Crée un modèle à partir du schéma
**العربية**: ينشئ نموذج من المخطط

```javascript
module.exports = mongoose.model('User', userSchema);
```

### `new Model()`
**English**: Creates a new document instance
**Français**: Crée une nouvelle instance de document
**العربية**: ينشئ مثيل مستند جديد

```javascript
const user = new User({ username, email, password });
```

---

## 🔍 Query Methods

### `Model.find()`
**English**: Finds all documents matching criteria
**Français**: Trouve tous les documents correspondant aux critères
**العربية**: يجد جميع المستندات المطابقة للمعايير

```javascript
const users = await User.find({}, '-password');
```

### `Model.findOne()`
**English**: Finds first document matching criteria
**Français**: Trouve le premier document correspondant aux critères
**العربية**: يجد أول مستند مطابق للمعايير

```javascript
const user = await User.findOne({ email });
```

### `Model.findById()`
**English**: Finds document by its ID
**Français**: Trouve un document par son ID
**العربية**: يجد مستند بواسطة معرفه

```javascript
const user = await User.findById(id, '-password');
```

### `Model.findByIdAndUpdate()`
**English**: Finds and updates document by ID
**Français**: Trouve et met à jour un document par ID
**العربية**: يجد ويحدث مستند بواسطة المعرف

```javascript
const user = await User.findByIdAndUpdate(id, data, { new: true });
```

### `Model.findByIdAndDelete()`
**English**: Finds and deletes document by ID
**Français**: Trouve et supprime un document par ID
**العربية**: يجد ويحذف مستند بواسطة المعرف

```javascript
const user = await User.findByIdAndDelete(id);
```

### `Model.find().populate()`
**English**: Fetches referenced documents
**Français**: Récupère les documents référencés
**العربية**: يجلب المستندات المشار إليها

```javascript
const posts = await Post.find().populate('author', 'username email');
```

---

## 📄 Document Methods

### `document.save()`
**English**: Saves document to database
**Français**: Sauvegarde le document dans la base de données
**العربية**: يحفظ المستند في قاعدة البيانات

```javascript
await user.save();
```

### `document.populate()`
**English**: Populates referenced fields in document
**Français**: Remplit les champs référencés dans le document
**العربية**: يملأ الحقول المشار إليها في المستند

```javascript
await post.populate('author', 'username email');
```

---

## ⚙️ Middleware

### `schema.pre('save')`
**English**: Runs before document is saved
**Français**: S'exécute avant que le document soit sauvegardé
**العربية**: يعمل قبل حفظ المستند

```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hash password logic
  next();
});
```

### `schema.pre('find')`
**English**: Runs before find queries
**Français**: S'exécute avant les requêtes de recherche
**العربية**: يعمل قبل استعلامات البحث

```javascript
userSchema.pre('find', function() {
  this.select('-password');
});
```

---

## 🎯 Schema Options

### `required`
**English**: Makes field mandatory
**Français**: Rend le champ obligatoire
**العربية**: يجعل الحقل إلزامي

```javascript
{ type: String, required: true }
```

### `unique`
**English**: Ensures field value is unique
**Français**: Assure que la valeur du champ est unique
**العربية**: يضمن أن قيمة الحقل فريدة

```javascript
{ type: String, unique: true }
```

### `default`
**English**: Sets default value for field
**Français**: Définit la valeur par défaut pour le champ
**العربية**: يحدد القيمة الافتراضية للحقل

```javascript
{ type: Date, default: Date.now }
```

### `min/max`
**English**: Sets minimum/maximum values for numbers
**Français**: Définit les valeurs minimales/maximales pour les nombres
**العربية**: يحدد القيم الدنيا/القصوى للأرقام

```javascript
{ type: Number, min: 0, max: 100 }
```

---

## 🔧 Query Operators

### `$or`
**English**: Matches any of the specified conditions
**Français**: Correspond à l'une des conditions spécifiées
**العربية**: يطابق أي من الشروط المحددة

```javascript
User.findOne({ $or: [{ email }, { username }] });
```

### `$and`
**English**: Matches all specified conditions
**Français**: Correspond à toutes les conditions spécifiées
**العربية**: يطابق جميع الشروط المحددة

```javascript
User.find({ $and: [{ age: { $gte: 18 } }, { active: true }] });
```

### `$gte/$lte`
**English**: Greater than or equal / Less than or equal
**Français**: Supérieur ou égal / Inférieur ou égal
**العربية**: أكبر من أو يساوي / أقل من أو يساوي

```javascript
User.find({ age: { $gte: 18, $lte: 65 } });
```

---

## 📊 Aggregation Methods

### `Model.aggregate()`
**English**: Performs aggregation operations
**Français**: Effectue des opérations d'agrégation
**العربية**: ينفذ عمليات التجميع

```javascript
const result = await User.aggregate([
  { $group: { _id: "$city", count: { $sum: 1 } } }
]);
```

---

## 🚀 Best Practices

1. **Always use async/await** for database operations
2. **Handle errors** with try/catch blocks
3. **Use select()** to exclude sensitive fields like passwords
4. **Validate data** before saving
5. **Use indexes** for frequently queried fields
6. **Populate references** when you need related data
7. **Use middleware** for common operations like password hashing

---

*This guide covers the most essential Mongoose methods and types for building robust MongoDB applications with Node.js.* 