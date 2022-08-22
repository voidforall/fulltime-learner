const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopApp')
        .then(() => {
            console.log("CONNECTION OPEN")
        })
        .catch(err => {
            console.log("ERROR!")
            console.log(err)
        })

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 20
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be positive!"]
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
});

// add instance method bound to schema objects
productSchema.methods.greet = function() {
    console.log("HELLO!");
    console.log(` - from ${this.name}`)
}

productSchema.methods.toggleOnSale = function () {
    this.onSale = !this.onSale;
    this.save();
}

productSchema.methods.addCategory = function (newCat) {
    this.categories.push(newCat);
    return this.save();
}

productSchema.statics.fireSale = function () {
    return this.updateMany({}, {onSale: true, price: 0})
}

const Product = mongoose.model('Product', productSchema);

const findProduct = async () => {
    const foundProduct = await Product.findOne({ name: "Bike Helmet" });
    console.log(foundProduct);
    await foundProduct.toggleOnSale();
    console.log(foundProduct)
}

findProduct();

// const bike = new Product({name: "Mountain Bike", 
//     price: 599, 
//     categories: ['Cycling', 'Safety'],
//     qty: {online: 0, inStore: 0}
// })

// bike.save()
//     .then(data => {
//         console.log("IT WORKED!");
//         console.log(data);
//     })
//     .catch(err => {
//         console.log("ERROR!");
//     })
