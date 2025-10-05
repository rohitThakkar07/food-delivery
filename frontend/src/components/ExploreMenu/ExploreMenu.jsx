import React from 'react'
import './exploreMenu.css'
import {menu_list} from '../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro ea repellat dicta? Possimus nisi consequuntur esse atque eos tempore reprehenderit. Quis necessitatibus eos quae voluptas cumque facilis illum consectetur totam.</p>
      <div className="explore-menu-list">
        {
          menu_list.map((item,index)=>{
            return(
              <div onClick={()=>setCategory(prev=> prev===item.menu_name?'All':item.menu_name)} key={index} className="explore-menu-list-item">
                <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                <p>{item.menu_name}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default ExploreMenu