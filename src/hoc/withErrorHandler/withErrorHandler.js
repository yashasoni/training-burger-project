import React, {Component} from 'react';
import Auxilliary from '../Auxilliary/Auxilliary';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component{
        constructor(props) {
            super(props);
            this.state = {
                error: null
            }
            this.reqInterceptor=axios.interceptors.request.use(req => {
                this.state.error= null;
                return req;
            });
            this.resInterceptor=axios.interceptors.response.use(res=>res, error => {
                this.state.error= error;
            })
            
        }
        componentWillUnmount(){
            axios.interceptors.request.eject(this.reqInterceptor)
            axios.interceptors.response.eject(this.resInterceptor)
        }
        // componentDidMount(){
        //     axios.interceptors.request.use(req => {
        //         this.setState({error: null});
        //         return req;
        //     });
        //     axios.interceptors.response.use(res=>res, error => {
        //         this.setState({error: error})
        //     })
        // }
        errorConfirmedHandler = () => {
            this.setState({error: null})
        }
        render(){
            return(
                <Auxilliary>
                    <Modal
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Auxilliary>
            )
        }
    }
}
export default withErrorHandler;