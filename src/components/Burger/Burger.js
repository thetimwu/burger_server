import React from "react";
import styles from "./Burger.module.css";
import BurgerIngredien from "./BurgerIngredient/BurgerIngredient";

import { withRouter } from "react-router-dom";

const burger = props => {
  let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
      return [...Array(props.ingredients[igKey])].map((_, i) => {
        return <BurgerIngredien key={igKey + i} type={igKey} />;
      });
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);
  //console.log(transformedIngredients);
  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start adding ingredients</p>;
  }
  return (
    <div className={styles.Burger}>
      <BurgerIngredien type="bread-top" />
      {transformedIngredients}
      <BurgerIngredien type="bread-bottom" />
    </div>
  );
};

export default withRouter(burger);
