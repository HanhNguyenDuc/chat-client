import React from 'react';
import Item from './message';

// import './message-list.scss'


export default class App extends React.Component {
    render () {
        return (
            <ul className="messages clo-md-5">
                {this.props.messages.map(item =>
                    <Item key={item.id} user={item.userId == this.props.user? true : false} message={item.message}/>
                )}   
            </ul>
        )
    }
}