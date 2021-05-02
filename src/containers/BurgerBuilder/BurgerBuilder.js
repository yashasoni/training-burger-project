import React,{Component} from 'react';
import Auxilliary from '../../hoc/Auxilliary/Auxilliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
//import * as actionTypes from '../../store/actions/actionTypes';
import * as actions from '../../store/actions/index';
// const INGREDIENT_PRICES={
//     salad: 0.5,
//     bacon: 0.4,
//     cheese: 1.3,
//     meat: 0.7   
// };
class BurgerBuilder extends Component{
    state={
        totalPrice: 4,
        purchasing: false
    }
    componentDidMount(){
        console.log(this.props);
        this.props.onInitIngredients();
        // axios.get('https://react-my-burger-f834b-default-rtdb.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data})
        //     })
        //     .catch(error => {
        //         this.setState({error: error})
        //     })
    }
    
    updatePurchaseState (ingredients){
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        })
        .reduce((sum, el)=>{
            return sum + el
        }, 0)
        //this.setState({purchasable: sum > 0})   //purchasable: true
        return sum>0
    }
    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type]
    //     const updatedCount = oldCount + 1
    //     const updatedIngredients ={
    //         ...this.state.ingredients
    //     }
    //     updatedIngredients[type]= updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
    //     this.updatePurchaseState(updatedIngredients)
    // }
    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type]
    //     if(oldCount <= 0){
    //         return;
    //     }
    //     const updatedCount = oldCount - 1
    //     const updatedIngredients ={
    //         ...this.state.ingredients
    //     }
    //     updatedIngredients[type]= updatedCount;
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
    //     this.updatePurchaseState(updatedIngredients)
    // }
    purchaseHandler = () =>{
        if(this.props.isAuthenticated){
            this.setState({purchasing: true})   
        }else{
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push("/auth");   //because of react-router
        }
        
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }
    purchaseContinueHandler =() =>{
        this.props.onInitPurchase();
        this.props.history.push("/checkout");
        //const queryParams =[];
        //for(let i in this.state.ingredients){
        //    queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        //}
        //queryParams.push('price=' + this.state.totalPrice)
        //const queryString =queryParams.join('&');
        //this.props.history.push({
        //    pathname: '/checkout',
        //    search: '?' + queryString
        //})
        
        //alert('You Continue!');
        // this.setState({loading: true})
        // const order= {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'Yasha Soni',
        //         address: {
        //             street: 'Juna Sarafa',
        //             zipCode: '444303',
        //             country: 'India'
        //         },
        //         email: 'test@test.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }
        // axios.post('/orders.json', order)
        //     .then(response =>{
        //         this.setState({loading: false, purchasing: false})
        //     })
        //     .catch(error => {
        //         this.setState({loading: false, purchasing: false})
        //     })
    }
    
    render(){
        const disabledInfo ={
            ...this.props.ings
        }
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0
        }
        //{salad: true, meat: false..}
        let orderSummary = null
        let burger = this.props.error ? <p style={{textAlign: 'center'}}>Ingredients can't be loaded</p> : <Spinner />
        if(this.props.ings){
            burger=(
                <Auxilliary>
                <Burger ingredients={this.props.ings}/>
                <BuildControls 
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved= {this.props.onIngredientRemoved}
                    disabled = {disabledInfo}
                    purchasable = {this.updatePurchaseState(this.props.ings)}
                    ordered={this.purchaseHandler}
                    price = {this.props.price}
                    isAuth={this.props.isAuthenticated}
                />
                </Auxilliary>
            )
            orderSummary = <OrderSummary 
                                ingredients = {this.props.ings}
                                price= {this.props.price}
                                purchaseContinued={this.purchaseContinueHandler}
                                purchaseCancelled={this.purchaseCancelHandler} />
        }
        // if(this.state.loading){
        //     orderSummary= <Spinner />
        // }
        return(
            <Auxilliary>
                <Modal 
                    show={this.state.purchasing}
                    modalClosed= {this.purchaseCancelHandler} >
                    {orderSummary}
                </Modal>
                {burger}
            </Auxilliary>
        )
    }
}
const mapStateToProps = state => {
    return{
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}
const mapDispatchToProps = dispatch => {
    return{
        //onIngredientAdded: (ingName) =>dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        //onIngredientRemoved: (ingName) =>dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));