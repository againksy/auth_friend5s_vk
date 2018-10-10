import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import logo from './logo.svg';
import './App.css';
 
const cookies = new Cookies();
const PUBLIC_PATH = process.env.REACT_APP_PUBLIC_URL ? process.env.REACT_APP_PUBLIC_URL : '/auth_friend5s_vk/'

class App extends Component {
  setRef = (widgetValue) => this.widgetValue = widgetValue;
  constructor(props){
    super(props)
    let user_params = cookies.get('friends_vk_app_6716385')
    this.state = {
      friends_info: {},
      showLogin: !user_params
    }
  }
  componentDidMount(){
    let user_params = cookies.get('friends_vk_app_6716385')
    let noUserParams = !user_params || !user_params.first_name
    if(noUserParams){
      this.initWidget()
    }
    let urlParams = new URLSearchParams(window.location.search);
    let first_name = urlParams.get('first_name');
    if(first_name){
      if(noUserParams){
        let uid = urlParams.get('uid');
        let last_name = urlParams.get('last_name')
        let photo = urlParams.get('photo')
        let photo_rec = urlParams.get('photo_rec')
        let hash = urlParams.get('hash')
        cookies.set('friends_vk_app_6716385', {uid, first_name, last_name, photo, photo_rec, hash}, { path: PUBLIC_PATH, maxAge: 3456000 })
      }
      window.location.href = PUBLIC_PATH
    }
    if(typeof window.VK !== undefined && !noUserParams){
        this.setState({
          friendsLoading: true,
        })
      window.VK.Api.call('friends.get', {
        fields: 'photo_rec', v: 5.85,
      }, (data)=>{
        this.setState({
          friends_info: data.response,
          friendsLoading: false,
        })
      });
    }
  }
  initWidget = () => {
    const child = document.createElement('div');
    this.widgetValue.appendChild(child);
    child.appendChild(
      document.createRange()
      .createContextualFragment(`<div>
                  <script type="text/javascript">
                    VK.Widgets.Auth("vk_auth", {"authUrl":"${ PUBLIC_PATH }"});
                  </script>
                </div>
              `)
      .firstChild
    );
  }
  render() {
    let { showLogin, friends_info, friendsLoading, } = this.state
    let friends = friends_info.items
    let friends_5 = []
    if(Array.isArray(friends)){
      friends_5 = shuffle(friends).slice(0,5)
    }
    let user_params = cookies.get('friends_vk_app_6716385')
    let { first_name, last_name, uid, } = user_params || {}
              
    return (
      <div className="App">
        <header className="App-header">
              <div style={{display: showLogin ? 'initial' : 'none'}}>
                <div id="vk_auth"></div>
                <div ref={this.setRef}></div>
              </div> 
              <div style={{display: showLogin ? 'none' : 'initital'}}>
                <div className="App-header_title">
                  <span className="Aht_you">Это Вы:</span>
                  <a href={'http://vk.com/id'+uid} target="_blank" rel="noopener noreferrer" className="Aht_cur-user-name">
                    <span>{first_name}</span>
                    <span>{last_name}</span>
                  </a>
                </div>
                <div className="App-header_logout" onClick={e=>{
                    cookies.remove('friends_vk_app_6716385', { path: PUBLIC_PATH })
                    window.location.href = PUBLIC_PATH
                  }}>
                  Logout
                </div>
              </div> 
        </header>
        { friendsLoading && <img src={logo} className="friends-loading" alt="logo" />}
        {!showLogin && <ul className="friends-list">
            {friends_5 && friends_5.map((f,i)=>
              <li className="friends-list_item"  key={i}>
                  <a className="friends-list_item-link" href={'http://vk.com/id'+f.id} target="_blank" rel="noopener noreferrer">
                    <span className="flil_friend-cell" title={f.first_name}>{f.first_name}</span>
                    <span className="flil_friend-cell" title={f.last_name}>{f.last_name}</span>
                    <img className="flil_friend-cell" alt="" src={`${f.photo_rec}`}></img>
                  </a>
                </li>
            )}
          </ul>
        }
      </div>
    );
  }
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default App;
