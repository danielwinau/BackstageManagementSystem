import React, { Component } from 'react'
import { connect} from 'react-redux';
import { Card, Button, Icon, List, message } from 'antd'
import './detail.less'
import { reqProdById, reqCategoryList } from '../../api'; 
import { BASE_URL } from '../../config';
const {Item}=List


class Detail extends Component {

    state={
        categoryId:'',
        categoryName:'',
        desc:'',
        detail:'',
        imgs:[],
        name:'',
        price:'',
        isLoading:true,
    }

    componentDidMount(){ 
        const {id}=this.props.match.params
        const reducProdList=this.props.productList
        const reducCateList=this.props.categoryList
        if (reducProdList.length) {
            let result = reducProdList.find(item=>item._id===id)
            if (result){
                this.categoryId=result.categoryId
                this.setState({...result})
            }
        }
        else this.getProdById(id)
        if (reducCateList.length) {
            let result = reducCateList.find(item=>item._id===this.categoryId)
            this.setState({categoryName:result.name, isLoading:false})
        }
        else this.getCategoryList()


    }

    getProdById= async (id)=>{
        let result= await reqProdById(id)
        const {status,data,msg}=result
        if (status===0) {
            this.categoryId=data.categoryId
            this.setState({...data})
        }
        else message.error(msg,1)
    }

    getCategoryList= async ()=>{
        let result= await reqCategoryList()
        const {status,data,msg}=result
        if (status===0) {
            let result = data.find(item=>item._id===this.categoryId)
            this.setState({categoryName:result.name, isLoading:false})
        }
        else message.error(msg,1)
    }

  render() {
    return (
        <div>
            <Card title={
                <div className='left-top'  >
                    <Button type='link' onClick={ ()=>{this.props.history.goBack()} } >
                        <Icon type="arrow-left" />
                    </Button>
                    <span>商品详情</span>
                </div>}
                loading={this.state.isLoading}
            >
                <List>
                    <Item>
                        <span className='prod-title'>商品名称：</span>
                        <span> {this.state.name} </span>
                    </Item>
                    <Item>
                        <span className='prod-title'>商品描述：</span>
                        <span>{this.state.desc}</span>
                    </Item>
                    <Item>
                        <span className='prod-title'>商品价格：</span>
                        <span>{this.state.price}</span>
                    </Item>
                    <Item>
                        <span className='prod-title'>所属分类：</span>
                        <span>{this.state.categoryName}</span>
                    </Item>
                    <Item>
                        <span className='prod-title'>商品图片：</span>
                        {
                            this.state.imgs.map((item, index)=>{
                                return <img key={index} src={`${BASE_URL}/upload/`+item} alt="商品图片" style={{width:'150px'}} />
                            })
                        }
                    </Item>
                    <Item>
                        <span className='prod-title'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html:this.state.detail}}></span>
                    </Item>
                </List>
            </Card>
        </div>
    )
  }
}

export default connect(
    state=>({
        productList:state.productList,
        categoryList:state.categoryList,
    })
)(Detail)