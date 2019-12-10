import React, { Component } from "react";
import Aux from "../../hoc/Auxios";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-order";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { connect } from "react-redux";
import * as actionType from "../../store/actions";

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    // axios
    //   .get("https://react-burger-d192a.firebaseio.com/ingredients.json")
    //   .then(response => {
    //     //console.log(response.data);
    //     this.setState({ ingredients: response.data });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     this.setState({ error: true });
    //   });
  }

  // addIngredientHandler = type => {
  //   const newIngredients = { ...this.state.ingredients };
  //   newIngredients[type]++;
  //   const newPrice = INGREDIENT_PRICE[type] + this.state.totalPrice;
  //   this.setState({
  //     ingredients: newIngredients,
  //     totalPrice: newPrice
  //   });
  //   this.updatePurchaseHandler(newIngredients);
  // };

  // deleteIngredientHandler = type => {
  //   const newIngredients = { ...this.state.ingredients };
  //   if (newIngredients[type] <= 0) {
  //     return;
  //   }
  //   newIngredients[type]--;
  //   const newPrice = this.state.totalPrice - INGREDIENT_PRICE[type];
  //   this.setState({
  //     ingredients: newIngredients,
  //     totalPrice: newPrice
  //   });
  //   this.updatePurchaseHandler(newIngredients);
  // };

  updatePurchaseHandler = newIngredients => {
    const sum = Object.keys(newIngredients)
      .map(igkey => {
        return newIngredients[igkey];
      })
      .reduce((total, prePrice) => {
        return total + prePrice;
      }, 0);
    return sum > 0;
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    //alert("continue!");

    // const queryParams = [];
    // for (let i in this.state.ingredients) {
    //   queryParams.push(
    //     encodeURIComponent(i) +
    //       "=" +
    //       encodeURIComponent(this.state.ingredients[i])
    //   );
    // }
    // queryParams.push("price=" + this.state.totalPrice);
    // const queryString = queryParams.join("&");

    this.props.history.push("/checkout");
  };

  render() {
    const ingredientStatus = { ...this.props.ings };
    for (let key in ingredientStatus) {
      ingredientStatus[key] = ingredientStatus[key] <= 0;
    }

    let orderSummary = null;

    let burger = this.state.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );

    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdd={this.props.onIngredientAdded}
            ingredientDelete={this.props.onIngredientRemoved}
            disabled={ingredientStatus}
            price={this.props.price}
            purchaseable={this.updatePurchaseHandler(this.props.ings)}
            ordered={this.purchaseHandler}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          ingredients={this.props.ings}
          price={this.props.price}
        />
      );
    }
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName =>
      dispatch({ type: actionType.ADD_INGREDIENT, ingredientName: ingName }),
    onIngredientRemoved: ingName =>
      dispatch({ type: actionType.REMOVE_INGREDIENT, ingredientName: ingName })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
