import React from 'react'
// import { withRouter } from 'react-router-dom'

import Button from './../../../Components/UI/Button/Button'
import classes from './ContactData.module.css'
import axios from './../../../axios-orders'
import Spinner from './../../../Components/UI/Spinner/Spinner'
import Input from './../../../Components/UI/Input/Input'

class ContactData extends React.Component {


    element = (input, type, placeholder, value) => {
        return {
            elementType: input,
            elementConfig: {
                type: type,
                placeholder: placeholder
            },
            value: value
        }
    }

    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            street: this.element('input', 'text', 'Street', ''),
            zipCode: this.element('input', 'text', 'ZIP Code', ''),
            country: this.element('input', 'text', 'Country', ''),
            email: this.element('input', 'email', 'Your E-mail', ''),
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
                    ]
                },
                value: 'fastest'
            }
        },
        loading: false
    }
    orderHandler = (event) => {
        event.preventDefault()
        console.log(this.props)
        const formData = {}
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
        }
        this.setState({ loading: true })
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false })
                this.props.history.push('/')
            })
            .catch(error => this.setState({ loading: false }))

    }

    inputChangeHandler = (event, inputIdentifier) => {
        const updatedOrderForm = { ...this.state.orderForm }
        const updatedFormElement = { ...updatedOrderForm[inputIdentifier] }
        updatedFormElement.value = event.target.value
        updatedOrderForm[inputIdentifier] = updatedFormElement

        this.setState({ orderForm: updatedOrderForm })
    }

    render() {

        let formElementArray = []
        for (let key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }



        let form = (
            <form className={classes.Form} onSubmit={this.orderHandler}>
                {formElementArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(e) => this.inputChangeHandler(e, formElement.id)} />
                ))}
                <Button btnType='Success'>ORDER</Button>
            </form>)
        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter Your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData
// export default withRouter(ContactData)