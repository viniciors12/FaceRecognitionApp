import React from "react";

const Navigation = ({onRouteChange, isSignedIn}) => {
    if (isSignedIn){
     return(
     <nav style={{ display: "flex", justifyContent: "flex-end " }}>
        <p onClick={()=>onRouteChange('signout') 
        /*Si se pone solo la llamada, el met se activa cuando se renderiza*/} className="f3 link dim black underline pa3 pointer">Sign out</p>
      </nav>
     );
    }
    else{
      return(
      <nav style={{ display: "flex", justifyContent: "flex-end " }}>
      <p onClick={()=>onRouteChange('signin') 
      /*Si se pone solo la llamada, el met se activa cuando se renderiza*/} className="f3 link dim black underline pa3 pointer">Sign in</p>
      <p onClick={()=>onRouteChange('register') 
      /*Si se pone solo la llamada, el met se activa cuando se renderiza*/} className="f3 link dim black underline pa3 pointer">Register</p>
      <p onClick={()=>onRouteChange('manage')} className="f3 link dim black underline pa3 pointer">Manage</p>
      </nav>
    
      );
    }
}

export default Navigation;
