import {Component} from 'react'

import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productDetailsList: [],
    similarProductList: [],
    count: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`

    const changeData = each => ({
      id: each.id,
      availability: each.availability,
      imageUrl: each.image_url,
      brand: each.brand,
      price: each.price,
      rating: each.rating,
      style: each.style,
      totalReviews: each.total_reviews,
      similarProducts: each.similar_products,
      description: each.description,
      title: each.title,
    })
    const response = await fetch(apiUrl)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = changeData(data)
      const updatedSimilarProducts = updatedData.similarProducts.map(each =>
        changeData(each),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        productDetailsList: updatedData,
        similarProductList: updatedSimilarProducts,
      })
    } else if (data.status_code === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickMinus = () => {
    const {count} = this.state
    return count > 1
      ? this.setState(prev => ({count: prev.count - 1}))
      : {count}
  }

  onClickPlus = () => {
    this.setState(prev => ({count: prev.count + 1}))
  }

  renderProductDetailsView = () => {
    const {productDetailsList, similarProductList, count} = this.state
    const {
      id,
      availability,
      imageUrl,
      brand,
      price,
      rating,
      style,
      totalReviews,
      similarProducts,
      description,
    } = productDetailsList
    return (
      <div className="product-app-container">
        <div className="product-container">
          <div className="product-image-container">
            <img src={imageUrl} className="product-image" alt="product" />
          </div>
          <div className="product-details-container">
            <h1 className="product-name">{style}</h1>
            <p>Rs {price}/- </p>
            <div className="review-container">
              <div className="rating-container">
                <p className="para-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="review-para">{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
            <hr />
            <div className="quantity-container">
              <BsDashSquare onClick={this.onClickMinus} testid="minus" />
              <p className="count-para">{count}</p>
              <BsPlusSquare onClick={this.onClickPlus} testid="plus" />
            </div>
            <button type="button">ADD TO CART</button>
          </div>
        </div>
        <ul className="similar-products-container">
          {similarProductList.map(product => (
            <SimilarProductItem
              similarProductDetails={product}
              key={product.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="failure view"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.onClickContinueShopping}>
        Continue Shopping
      </button>
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductDetails()}
      </>
    )
  }
}

export default ProductItemDetails
