import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [products, setProducts] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: ""
  })

  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/products"
      )

      setProducts(response.data)

    } catch (error) {
      console.log(error)
    }

  }

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if(editId){

      try {

        const response = await axios.put(
          `http://localhost:5000/products/${editId}`,
          formData
        )

        setProducts(
          products.map((product) =>
            product.id === editId
              ? response.data
              : product
          )
        )

        resetForm()

      } catch (error) {
        console.log(error)
      }

    }else{

      try {

        const response = await axios.post(
          "http://localhost:5000/products",
          formData
        )

        setProducts([
          response.data,
          ...products
        ])

        resetForm()

      } catch (error) {
        console.log(error)
      }

    }

  }

  const editProduct = (product) => {

    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category
    })

    setEditId(product.id)

  }

  const deleteProduct = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/products/${id}`
      )

      setProducts(
        products.filter(
          (product) => product.id !== id
        )
      )

    } catch (error) {
      console.log(error)
    }

  }

  const resetForm = () => {

    setFormData({
      name: "",
      price: "",
      quantity: "",
      category: ""
    })

    setEditId(null)

  }

  return (

    <div className="container">

      <h1>Product Inventory Management</h1>

      <form
        className="product-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <button type="submit">

          {
            editId
              ? "Update Product"
              : "Add Product"
          }

        </button>

      </form>

      <div className="inventory-list">

        {
          products.map((product) => (

            <div
              className="product-card"
              key={product.id}
            >

              <h3>{product.name}</h3>

              <p>
                <strong>Price:</strong>
                {" "}
                ₹{product.price}
              </p>

              <p>
                <strong>Quantity:</strong>
                {" "}
                {product.quantity}
              </p>

              <p>
                <strong>Category:</strong>
                {" "}
                {product.category}
              </p>

              <div className="buttons">

                <button
                  className="edit-btn"
                  onClick={() =>
                    editProduct(product)
                  }
                >
                  Update
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteProduct(product.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  )

}

export default App