import React, { Component, Fragment } from "react";
// import { injectIntl} from 'react-intl';
import {
  Row,
  Card,
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonDropdown,
  UncontrolledDropdown,
  Collapse,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
  CardBody,
  CardSubtitle,
  Spinner,
  CardImg,
  Label,
  CardText,
  Badge
} from "reactstrap";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import CustomSelectInput from "Components/CustomSelectInput";
import classnames from "classnames";

// import IntlMessages from "Util/IntlMessages";
import { Colxx, Separator } from "Components/CustomBootstrap";
import { BreadcrumbItems } from "Components/BreadcrumbContainer";

import Pagination from "Components/List/Pagination";
import mouseTrap from "react-mousetrap";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
function collect(props) {
  return { data: props.data };
}
import { servicePath } from 'Constants/defaultValues'
const apiUrl =servicePath+"/cakes/paging"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class ThumbListLayout extends Component {
    constructor(props) {
      super(props);
      this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);
      this.toggleSplit = this.toggleSplit.bind(this);
      this.dataListRender = this.dataListRender.bind(this);
      this.toggleModal = this.toggleModal.bind(this);
      this.getIndex = this.getIndex.bind(this);
      this.onContextMenuClick = this.onContextMenuClick.bind(this)
      this.changeInputValue = this.changeInputValue.bind(this);
      this.onChangeImage = this.onChangeImage.bind(this);
      this.onChangeSelectBox = this.onChangeSelectBox.bind(this);
      this.submitForm = this.submitForm.bind(this);
      this.deleteBanks = this.deleteBanks.bind(this);
      this.toogleEditModal = this.toogleEditModal.bind(this);
      this.updateData = this.updateData.bind(this);


      this.state = {
        displayMode: "thumblist",
        pageSizes: [8, 12, 24],
        selectedPageSize: 8,
        isLoadingButton: false,
        selectedActiveValue: null,
        isEditMode: false,
        activeValues: [
          {label: "True", value: "True", key:0},
          {label: "False", value: "False", key:1}
        ],
        categories:  [
          {label:'Cakes',value:'Cakes',key:0},
          {label:'Cupcakes',value:'Cupcakes',key:1},
          {label:'Desserts',value:'Desserts',key:2},
        ],
        orderOptions:[
          {column: "title",label: "Product Name"},
          {column: "category",label: "Category"},
          {column: "status",label: "Status"}
        ],
        selectedOrderOption:  {column: "title",label: "Product Name"},
        dropdownSplitOpen: false,
        modalOpen: false,
        currentPage: 1,
        totalItemCount: 0,
        totalPage: 1,
        username: "",
        email:"",
        name:"",
        password:"",
        active: "",
        image: "",
        imageUrl: "https://www.waterfront.co.za/wp-content/uploads/2018/05/nedbank.jpg",
        search: "",
        selectedItems: [],
        lastChecked: null,
        displayOptionsIsOpen: false,
        isLoading:false
      };
    }



    submitForm() {
      if (this.state.name == "") {
        toast.warn("Name Field is Required!", {
          position: "top-left"
        })
      }else if(this.state.username == "") {
        toast.warn("Username Field is Required!", {
          position: "top-left"
        })
      }else if (this.state.email == "") {
        toast.warn("Email Field is Required!", {
          position: "top-left"
        })
      }else if (this.state.password == "") {
        toast.warn("Password Field is Required!", {
          position: "top-left"
        })
      }else if (this.state.active == "") {
        toast.warn("Active Field is Required!", {
          position: "top-left"
        })
      }else if (this.state.image == "") {
        toast.warn("Image Field is Required!", {
          position: "top-left"
        })
      }else {
        this.setState({isLoadingButton: true});
        const formData = new FormData();
        formData.append("file", this.state.image)
        formData.append("upload_preset", "c7tuhhpg")
        const data = {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          username: this.state.username,
          active: this.state.active,
          image: this.state.imageUrl
        }
        axios({
          method: "POST",
          url: "https://api.cloudinary.com/v1_1/mentor-sol/image/upload",
          data: formData,
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(res => {
          data.image = res.data.url;
          axios({
            method: "POST",
            url: "/api/banks",
            data: data
          }).then((res) => {
            this.setState({isLoadingButton: false});
            this.toggleModal();
            this.dataListRender();
            this.setState({
              name: "",
              email:"",
              password: "",
              username: "",
              active: "",
              image: ""
            })
          }).catch((err) => {
            console.log(err);
            toast.error("There is some error to save data in database please try again.", {
              position: "top-left"
            })
          })
        }).catch(err => {
          console.log(err);
          toast.error("There is some error to upload image. Please Try Again!")
        })
      }
    }


    deleteBanks() {
      if (this.state.selectedItems.length > 0) {
        for(var i = 0; i < this.state.selectedItems.length; i++) {
          console.log(this.state.selectedItems[i]);
          axios({
            method: 'DELETE',
            url: "/api/banks",
            data: {id: this.state.selectedItems[i]}
          }).then(res => {
            if (res.data.success) {
              toast(res.data.message, {
                position: 'top-left',
              })
              this.dataListRender();
            }
          }).catch(err => {
            console.log(err);
          })
        }
      }
    }

    updateData() {
        if (this.state.selectedItems.length == 1) {
               if (this.state.name == "") {
        toast.warn("Name Field is Required!", {
          position: "top-left"
        })
      }else if(this.state.username == "") {
        toast.warn("Username Field is Required!", {
          position: "top-left"
        })
      }else if (this.state.email == "") {
        toast.warn("Email Field is Required!", {
          position: "top-left"
        })
      }else if (this.state.password == "") {
        toast.warn("Password Field is Required!", {
          position: "top-left"
        })
      }else if (this.state.active == "") {
        toast.warn("Active Field is Required!", {
          position: "top-left"
        })
      }else if (this.state.image == "") {
        toast.warn("Image Field is Required!", {
          position: "top-left"
        })
      }else {
          this.setState({isLoadingButton: true});
          const data = this.state.items.filter((e) => e.id == this.state.selectedItems[0]);
          const formData = new FormData();
          formData.append("file", this.state.image)
          formData.append("upload_preset", "c7tuhhpg")
            const updateData = {
                id: data[0].id,
                email: this.state.email,
                password: this.state.password,
                username: this.state.username,
                name: this.state.name,
                image: this.state.imageUrl,
                active: this.state.active
            };
             axios({
              method: "POST",
              url: "https://api.cloudinary.com/v1_1/mentor-sol/image/upload",
              data: formData,
              headers: {
                'Content-Type': 'application/json'
              },
            }).then(res => {
              updateData.image = res.data.url;
                axios({
                    method: "POST",
                    url: "/api/banks/edit",
                    data: updateData
                }).then((res) => {
                    if (res.data.error) {
                        toast.error(res.data.message, {
                            position: "top-left"
                        })
                        this.setState({
                            isLoadingButton: false
                        })
                    }else if (res.data.info) {
                        toast.warn(res.data.message, {
                            position: "top-left"
                        })
                        this.setState({
                            isLoadingButton: false
                        })
                    }else if (res.data.success) {
                        this.toggleModal();
                        toast(res.data.message, {
                            position: "top-left"
                        })
                        this.dataListRender();
                    }else {
                        toast.warn(res.data.message, {
                            position: "top-left"
                        })
                        this.setState({
                            isLoadingButton: false
                        })
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }).catch((err) => {
              console.log(err);
            })

      }
        }else {
            toast("Please Select One Item To Edit", {
                position: "top-left"
            })
            this.setState({
                modalOpen: false,
                isEditMode: false,
                isLoadingButton: false,
            })
        }
    }

    toogleEditModal() {
        if (this.state.selectedItems.length == 1) {
            const data = this.state.items.filter((e) => e.id == this.state.selectedItems[0]);
            console.log(data);
            this.setState({
                modalOpen: !this.state.modalOpen,
                isEditMode: true,
                password: "",
                email: data[0].email,
                username: data[0].username,
                name: data[0].name,
                selectedActiveValue: data[0].active
            })
        }else {
            toast("Please Select One Item To Edit", {
                position: "top-left"
            })
        }
    }

    toggleModal() {
      this.setState({
        modalOpen: !this.state.modalOpen,
        isEditMode: false,
        isLoadingButton: false
      });
    }
    
    toggleDisplayOptions() {
      this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
    }
    toggleSplit() {
      this.setState(prevState => ({
        dropdownSplitOpen: !prevState.dropdownSplitOpen
      }));
    }
    changeOrderBy(column) {
      this.setState(
        {
          selectedOrderOption: this.state.orderOptions.find(
            x => x.column === column
          )
        },
        () => this.dataListRender()
      );
    }
    changePageSize(size) {
      this.setState(
        {
          selectedPageSize: size,
          currentPage: 1
        },
        () => this.dataListRender()
      );
    }
    changeDisplayMode(mode) {
      this.setState({
        displayMode: mode
      });
      return false;
    }
    onChangePage(page) {
      this.setState(
        {
          currentPage: page
        },
        () => this.dataListRender()
      );
    }

    handleKeyPress(e) {
      if (e.key === "Enter") {
        this.setState(
          {
            search: e.target.value.toLowerCase()
          },
          () => this.dataListRender()
        );
      }
    }

    handleCheckChange(event, id) {
      if (
        event.target.tagName == "A" ||
        (event.target.parentElement &&
          event.target.parentElement.tagName == "A")
      ) {
        return true;
      }
      if (this.state.lastChecked == null) {
        this.setState({
          lastChecked: id
        });
      }

      let selectedItems = this.state.selectedItems;
      if (selectedItems.includes(id)) {
        selectedItems = selectedItems.filter(x => x !== id);
      } else {
        selectedItems.push(id);
      }
      this.setState({
        selectedItems
      });

      if (event.shiftKey) {
        var items = this.state.items;
        var start = this.getIndex(id, items, "id");
        var end = this.getIndex(this.state.lastChecked, items, "id");
        items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
        selectedItems.push(
          ...items.map(item => {
            return item.id;
          })
        );
        selectedItems = Array.from(new Set(selectedItems));
        this.setState({
          selectedItems
        });
      }
      document.activeElement.blur();
    }

    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    }
    handleChangeSelectAll(isToggle) {
      if (this.state.selectedItems.length >= this.state.items.length) {
        if (isToggle) {
          this.setState({
            selectedItems: []
          });
        }
      } else {
        this.setState({
          selectedItems: this.state.items.map(x => x.id)
        });
      }
      document.activeElement.blur();
      return false;
    }
    componentDidMount() {
      this.dataListRender();
    }

    changeInputValue(e) {
      this.setState({[e.target.name]: e.target.value});
    }

    onChangeImage(e) {
      this.setState({image: e.target.files[0]})
      // console.log(e.target.files[0]);
    }

    onChangeSelectBox(e) {
      this.setState({active: e.value, selectedActiveValue: e.value});
      // console.log(e.value);
    }

    dataListRender() {
      axios({
        method: "POST",
        url: `/api/banks/all`,
        data: {limit: this.state.selectedPageSize, offset: (this.state.currentPage - 1) * this.state.selectedPageSize}
      }).then((res) => {
        this.setState({
              totalPage: Math.ceil(res.data.totalPages),
              // totalPage: 4,
              items: res.data.message,
              selectedItems:[],
              totalItemCount: res.data.totalItems,
              // totalItemCount: 23,
              isLoading:true})
        console.log(res.data);
      }).catch((err) => {
        console.log(err);
      })
      
      // const {selectedPageSize,currentPage,selectedOrderOption,search} = this.state;
      // axios.get(`${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${selectedOrderOption.column}&search=${search}`)
      // .then(res => {
      //   return res.data        
      // }).then(data=>{
      //   this.setState({
      //     totalPage: data.totalPage,
      //     items: data.data,
      //     selectedItems:[],
      //     totalItemCount : data.totalItem,
      //     isLoading:true
      //   });
      // })
    }

    onContextMenuClick = (e, data, target) => {
      console.log("onContextMenuClick - selected items",this.state.selectedItems)
      console.log("onContextMenuClick - action : ", data.action);
    };

    onContextMenu = (e, data) => {
      const clickedProductId = data.data;
      if (!this.state.selectedItems.includes(clickedProductId)) {
        this.setState({
          selectedItems :[clickedProductId]
        });
      }

      return true;
    };

    render() {
      const startIndex= (this.state.currentPage-1)*this.state.selectedPageSize
      const endIndex= (this.state.currentPage)*this.state.selectedPageSize
      // const {messages} = this.props.intl;
      return (
        !this.state.isLoading?
          <div className="loading"></div>
       :
        <Fragment>
          <ToastContainer />
          <div className="disable-text-selection">
            <Row>
              <Colxx xxs="12">
                <div className="mb-2">
                  <h1>
                    Banks
                  </h1>

                  <div className="float-sm-right">
                    <Button
                      color="primary"
                      size="lg"
                      className="top-right-button"
                      onClick={this.toggleModal}
                    >
                      ADD BANK
                    </Button>
                    {"  "}

                    <Modal
                      isOpen={this.state.modalOpen}
                      toggle={this.toggleModal}
                      wrapClassName="modal-right"
                      backdrop="static"
                    >
                      <ModalHeader toggle={this.toggleModal}>
                        Add Bank
                      </ModalHeader>
                      <ModalBody>
                        <Label>
                          Bank Name
                        </Label>
                        <Input type="text" className="mb-2" value={this.state.name} onChange={this.changeInputValue} name="name" required />
                        <Label>
                          Username
                        </Label>
                        <Input type="text" className="mb-2" value={this.state.username} onChange={this.changeInputValue} name="username" required />
                        <Label>
                          Email
                        </Label>
                        <Input type="text" className="mb-2" value={this.state.email} onChange={this.changeInputValue} name="email" required />
                        <Label>
                          Password
                        </Label>
                        <Input type="password" className="mb-2" value={this.state.password} onChange={this.changeInputValue} name="password" required />
                        {/* <Label className="mt-4">
                          <IntlMessages id="pages.category" />
                        </Label> */}
                        {/* <Select
                          components={{ Input: CustomSelectInput }}
                          className="react-select"
                          classNamePrefix="react-select"
                          name="form-field-name"
                          options={this.state.categories}
                        /> */}
                        {/* <Label className="mt-4">
                          <IntlMessages id="pages.description" />
                        </Label>
                        <Input type="textarea" name="text" id="exampleText" /> */}
                        <Label className="mt-4">
                          Upload Logo
                        </Label>
                        <Input type="file" onChange={this.onChangeImage} className="form-control" name="text" id="exampleText" />
                        <Label className="mt-4">
                          Active
                        </Label>
                        <Select
                          className="react-select"
                          classNamePrefix="react-select"
                          onChange={this.onChangeSelectBox}
                          value = {
                            this.state.activeValues.filter(option => 
                                option.label === this.state.selectedActiveValue)
                          }
                          name="active"
                          options={this.state.activeValues} />
                        {/* <CustomInput
                          type="radio"
                          id="exCustomRadio"
                          name="customRadio"
                          label="true"
                        />
                        <CustomInput
                          type="radio"
                          id="exCustomRadio2"
                          name="customRadio"
                          label="false"
                        /> */}
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="secondary"
                          outline
                          className="px-3 pb-0"
                          onClick={this.toggleModal}
                        >
                          <label>Cancel</label>
                        </Button>
                        {(this.state.isLoadingButton == false ? 
                          <Button color="primary" className="px-4 pb-0" onClick={(this.state.isEditMode ? this.updateData : this.submitForm)}>
                            <label>{(this.state.isEditMode ? "Update" : "Submit")}</label>
                          </Button>
                        : 
                          <Button color="grey" disabled className="px-4 pb-0">
                            <label>{(this.state.isEditMode ? "Update" : "Submit")}</label>
                          </Button>)}
                        {/* <Button color="primary" onClick={this.submitForm}>
                          <label>Submit</label>
                        </Button>{" "} */}
                      </ModalFooter>
                    </Modal>
                    <ButtonDropdown
                      isOpen={this.state.dropdownSplitOpen}
                      toggle={this.toggleSplit}
                    >
                      <div className="btn btn-primary pl-4 pr-0 check-button">
                        <Label
                          for="checkAll"
                          className="custom-control custom-checkbox mb-0 d-inline-block"
                        >
                          <Input
                            className="custom-control-input"
                            type="checkbox"
                            id="checkAll"
                            checked={
                              this.state.selectedItems.length >=
                              this.state.items.length
                            }
                            onClick={() => this.handleChangeSelectAll(true)}
                          />
                          <span
                            className={`custom-control-label ${
                              this.state.selectedItems.length > 0 &&
                              this.state.selectedItems.length <
                                this.state.items.length
                                ? "indeterminate"
                                : ""
                            }`}
                          />
                        </Label>
                      </div>
                      <DropdownToggle
                        caret
                        color="primary"
                        className="dropdown-toggle-split pl-2 pr-2"
                      />
                      <DropdownMenu right>
                        <DropdownItem onClick={this.deleteBanks}>
                          <label>Delete</label>
                        </DropdownItem>
                        <DropdownItem onClick={this.toogleEditModal}>
                          <label>Edit</label>
                        </DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>

                  {/* <BreadcrumbItems match={this.props.match} /> */}
                </div>

                <div className="mb-2">
                  {/* <Button
                    color="empty"
                    className="pt-0 pl-0 d-inline-block d-md-none"
                    onClick={this.toggleDisplayOptions}
                  >
                    <IntlMessages id="pages.display-options" />{" "}
                    <i className="simple-icon-arrow-down align-middle" />
                  </Button> */}
                  <Collapse
                    isOpen={this.state.displayOptionsIsOpen}
                    className="d-md-block"
                    id="displayOptions"
                  >
                   <span className="mr-3 mb-2 d-inline-block float-md-left">
                    <a
                      className={`mr-2 view-icon ${
                        this.state.displayMode === "list" ? "active" : ""
                        }`}
                      onClick={() => this.changeDisplayMode("list")}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19">
                    <path className="view-icon-svg" d="M17.5,3H.5a.5.5,0,0,1,0-1h17a.5.5,0,0,1,0,1Z" />
                    <path className="view-icon-svg" d="M17.5,10H.5a.5.5,0,0,1,0-1h17a.5.5,0,0,1,0,1Z" />
                    <path className="view-icon-svg" d="M17.5,17H.5a.5.5,0,0,1,0-1h17a.5.5,0,0,1,0,1Z" /></svg>
                    </a>
                    <a
                      className={`mr-2 view-icon ${
                        this.state.displayMode === "thumblist" ? "active" : ""
                        }`}
                      onClick={() => this.changeDisplayMode("thumblist")}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19">
                    <path className="view-icon-svg" d="M17.5,3H6.5a.5.5,0,0,1,0-1h11a.5.5,0,0,1,0,1Z" />
                    <path className="view-icon-svg" d="M3,2V3H1V2H3m.12-1H.88A.87.87,0,0,0,0,1.88V3.12A.87.87,0,0,0,.88,4H3.12A.87.87,0,0,0,4,3.12V1.88A.87.87,0,0,0,3.12,1Z" />
                    <path className="view-icon-svg" d="M3,9v1H1V9H3m.12-1H.88A.87.87,0,0,0,0,8.88v1.24A.87.87,0,0,0,.88,11H3.12A.87.87,0,0,0,4,10.12V8.88A.87.87,0,0,0,3.12,8Z" />
                    <path className="view-icon-svg" d="M3,16v1H1V16H3m.12-1H.88a.87.87,0,0,0-.88.88v1.24A.87.87,0,0,0,.88,18H3.12A.87.87,0,0,0,4,17.12V15.88A.87.87,0,0,0,3.12,15Z" />
                    <path className="view-icon-svg" d="M17.5,10H6.5a.5.5,0,0,1,0-1h11a.5.5,0,0,1,0,1Z" />
                    <path className="view-icon-svg" d="M17.5,17H6.5a.5.5,0,0,1,0-1h11a.5.5,0,0,1,0,1Z" /></svg>
                    </a>
                    <a
                      className={`mr-2 view-icon ${
                        this.state.displayMode === "imagelist" ? "active" : ""
                        }`}
                      onClick={() => this.changeDisplayMode("imagelist")}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19">
                    <path className="view-icon-svg" d="M7,2V8H1V2H7m.12-1H.88A.87.87,0,0,0,0,1.88V8.12A.87.87,0,0,0,.88,9H7.12A.87.87,0,0,0,8,8.12V1.88A.87.87,0,0,0,7.12,1Z" />
                    <path className="view-icon-svg" d="M17,2V8H11V2h6m.12-1H10.88a.87.87,0,0,0-.88.88V8.12a.87.87,0,0,0,.88.88h6.24A.87.87,0,0,0,18,8.12V1.88A.87.87,0,0,0,17.12,1Z" />
                    <path className="view-icon-svg" d="M7,12v6H1V12H7m.12-1H.88a.87.87,0,0,0-.88.88v6.24A.87.87,0,0,0,.88,19H7.12A.87.87,0,0,0,8,18.12V11.88A.87.87,0,0,0,7.12,11Z" />
                    <path className="view-icon-svg" d="M17,12v6H11V12h6m.12-1H10.88a.87.87,0,0,0-.88.88v6.24a.87.87,0,0,0,.88.88h6.24a.87.87,0,0,0,.88-.88V11.88a.87.87,0,0,0-.88-.88Z" /></svg>
                    </a>
                  </span>

                    <div className="d-block d-md-inline-block">
                      {/* <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                        <DropdownToggle caret color="outline-dark" size="xs">
                          <IntlMessages id="pages.orderby" />
                          {this.state.selectedOrderOption.label}
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.orderOptions.map((order, index) => {
                            return (
                              <DropdownItem
                                key={index}
                                onClick={() => this.changeOrderBy(order.column)}
                              >
                                {order.label}
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown> */}
                      <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                        <input
                          type="text"
                          name="keyword"
                          id="search"
                          placeholder={"Search"}
                          onKeyPress={e => this.handleKeyPress(e)}
                        />
                      </div>
                    </div>
                    <div className="float-md-right">
                      <span className="text-muted text-small mr-1">{`${startIndex}-${endIndex} of ${
                        this.state.totalItemCount
                      } `}</span>
                      <UncontrolledDropdown className="d-inline-block">
                        <DropdownToggle caret color="outline-dark" size="xs">
                          {this.state.selectedPageSize}
                        </DropdownToggle>
                        <DropdownMenu right>
                          {this.state.pageSizes.map((size, index) => {
                            return (
                              <DropdownItem
                                key={index}
                                onClick={() => this.changePageSize(size)}
                              >
                                {size}
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </Collapse>
                </div>
                <Separator className="mb-5" />
              </Colxx>
            </Row>
            <Row>
              {this.state.items.map(product => {
                if (this.state.displayMode === "imagelist") {
                  return (
                    <Colxx
                      sm="6"
                      lg="4"
                      xl="3"
                      className="mb-3 rounded"
                      style={{borderRadius: '100px'}}
                      key={product.id}
                    >
                      <ContextMenuTrigger
                        id="menu_id"
                        data={product.id}
                        collect={collect}
                      >
                        <Card
                          onClick={event =>
                            this.handleCheckChange(event, product.id)
                          }
                          className={classnames({
                            active: this.state.selectedItems.includes(
                              product.id
                            )
                          })}
                        >
                          <div className="position-relative">
                            <NavLink
                              to={`?p=${product.id}`}
                              className="w-40 w-sm-100"
                            >
                              <CardImg
                                top
                                alt={product.username}
                                src={product.image}
                              />
                            </NavLink>
                            <Badge
                              color={product.statusColor}
                              pill
                              className="position-absolute badge-top-left"
                            >
                              {product.active}
                            </Badge>
                          </div>
                          <CardBody>
                            <Row>
                              <Colxx xxs="2">
                                <CustomInput
                                  className="itemCheck mb-0"
                                  type="checkbox"
                                  id={`check_${product.id}`}
                                  checked={this.state.selectedItems.includes(
                                    product.id
                                  )}
                                  onChange={() => {}}
                                  label=""
                                />
                              </Colxx>
                              <Colxx xxs="10" className="mb-3">
                                <CardSubtitle>{product.username}</CardSubtitle>
                                <CardText className="text-muted text-small mb-0 font-weight-light">
                                  {product.email}
                                </CardText>
                              </Colxx>
                            </Row>
                          </CardBody>
                        </Card>
                      </ContextMenuTrigger>
                    </Colxx>
                  );
                } else if (this.state.displayMode === "thumblist") {
                  return (
                    <Colxx xxs="12" key={product.id} className="mb-3">
                      <ContextMenuTrigger
                        id="menu_id"
                        data={product.id}
                        collect={collect}
                      >
                        <Card
                          onClick={event =>
                            this.handleCheckChange(event, product.id)
                          }
                          className={classnames("d-flex flex-row", {
                            active: this.state.selectedItems.includes(
                              product.id
                            )
                          })}
                        >
                          <NavLink
                            to={`?p=${product.id}`}
                            className="d-flex"
                          >
                            <img
                              alt={product.username}
                              src={product.image}
                              className="list-thumbnail responsive border-0"
                            />
                          </NavLink>
                          <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                            <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                              <NavLink
                                to={`?p=${product.id}`}
                                className="w-40 w-sm-100"
                              >
                                <p className="list-item-heading mb-1 truncate">
                                  {product.username}
                                </p>
                              </NavLink>
                              <p className="mb-1 text-muted text-small w-15 w-sm-100">
                                {product.category}
                              </p>
                              <p className="mb-1 text-muted text-small w-15 w-sm-100">
                                {product.email}
                              </p>
                              <div className="w-15 w-sm-100">
                                <Badge color={product.statusColor} pill>
                                  {product.active}
                                </Badge>
                              </div>
                            </div>
                            <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                              <CustomInput
                                className="itemCheck mb-0"
                                type="checkbox"
                                id={`check_${product.id}`}
                                checked={this.state.selectedItems.includes(
                                  product.id
                                )}
                                onChange={() => {}}
                                label=""
                              />
                            </div>
                          </div>
                        </Card>
                      </ContextMenuTrigger>
                    </Colxx>
                  );
                } else {
                  return (
                    <Colxx xxs="12" key={product.id} className="mb-3">
                      <ContextMenuTrigger
                        id="menu_id"
                        data={product.id}
                        collect={collect}
                      >
                        <Card
                          onClick={event =>
                            this.handleCheckChange(event, product.id)
                          }
                          className={classnames("d-flex flex-row", {
                            active: this.state.selectedItems.includes(
                              product.id
                            )
                          })}
                        >
                          <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                            <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                              <NavLink
                                to={`?p=${product.id}`}
                                className="w-40 w-sm-100"
                              >
                                <p className="list-item-heading mb-1 truncate">
                                  {product.username}
                                </p>
                              </NavLink>
                              <p className="mb-1 text-muted text-small w-15 w-sm-100">
                                {product.category}
                              </p>
                              <p className="mb-1 text-muted text-small w-15 w-sm-100">
                                {product.email}
                              </p>
                              <div className="w-15 w-sm-100">
                                <Badge color={product.statusColor} pill>
                                  {product.active}
                                </Badge>
                              </div>
                            </div>
                            <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                              <CustomInput
                                className="itemCheck mb-0"
                                type="checkbox"
                                id={`check_${product.id}`}
                                checked={this.state.selectedItems.includes(
                                  product.id
                                )}
                                onChange={() => {}}
                                label=""
                              />
                            </div>
                          </div>
                        </Card>
                      </ContextMenuTrigger>
                    </Colxx>
                  );
                }
              })}
              <Pagination
                currentPage={this.state.currentPage}
                totalPage={this.state.totalPage}
                onChangePage={i => this.onChangePage(i)}
              />
            </Row>
          </div>

          <ContextMenu
            id="menu_id"
            onShow={e => this.onContextMenu(e, e.detail.data)}
          >
            <MenuItem
              onClick={this.onContextMenuClick}
              data={{ action: "copy" }}
            >
              <i className="simple-icon-docs" /> <span>Copy</span>
            </MenuItem>
            <MenuItem
              onClick={this.onContextMenuClick}
              data={{ action: "move" }}
            >
              <i className="simple-icon-drawer" /> <span>Move to archive</span>
            </MenuItem>
            <MenuItem
              onClick={this.onContextMenuClick}
              data={{ action: "delete" }}
            >
              <i className="simple-icon-trash" /> <span>Delete</span>
            </MenuItem>
          </ContextMenu>
        </Fragment>
      );
    }
  }
  export default ThumbListLayout;
