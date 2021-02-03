import React from 'react'
import Order from './../../Components/Order/Order'
import axios from './../../axios-orders'
import withErrorHandler from './../../hoc/withErrorHandler/withErrorHandler'

class Orders extends React.Component {

    state = {
        orders: [],
        loading: true
    }

    componentDidMount() {
        axios.get('/orders.json')
            .then(res => {
                const fetchOrders = []
                for(let key in res.data){
                    fetchOrders.push({
                        ...res.data[key],
                        id: key
                    })
                }
                this.setState({ loading: false, orders: fetchOrders })
            })
            .catch(err => {
                console.log(err)
                this.setState({ loading: false })
            })
    }

    render() {
        return (
            <div>
                <Order />
                <Order />
            </div>
        )
    }
}

export default withErrorHandler(Orders, axios)