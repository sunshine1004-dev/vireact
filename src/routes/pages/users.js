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
  CardTitle,
  Table,
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
      this.updateData = this.updateData.bind(this);
      this.toogleEditModal = this.toogleEditModal.bind(this);

      this.state = {
        displayMode: "thumblist",
        pageSizes: [8, 12, 24],
        selectedPageSize: 8,
        isEditMode: false,
        isLoadingButton: false,
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
        if (this.state.email == "") {
        toast.warn("Email Field is Required!", {
          position: "top-left"
        })
      }else if (this.state.password == "") {
        toast.warn("Password Field is Required!", {
          position: "top-left"
        })
      }else {
        this.setState({isLoadingButton: true});
        const data = {
          email: this.state.email,
          password: this.state.password,
        }
          axios({
            method: "POST",
            url: "/api/users",
            data: data
          }).then((res) => {
              if (res.data.info) {
                  toast.warn(res.data.message, {
                      position: "left-top"
                  })
              }else if (res.data.error) {
                  toast.warn(res.data.message, {
                      position: "left-top"
                  })
              }else if (res.data.success) {
                  this.setState({isLoadingButton: false});
                    this.toggleModal();
                    this.dataListRender();
                    this.setState({
                        email:"",
                        password: ""
                    })
              }else {
                  toast.error("There as an error", {
                      position: "top-left"
                  })
              }
        }).catch(err => {
          console.log(err);
          toast.error("There was another error!")
        })
      }
    }


    deleteBanks() {
      if (this.state.selectedItems.length > 0) {
        for(var i = 0; i < this.state.selectedItems.length; i++) {
          console.log(this.state.selectedItems[i]);
          axios({
            method: 'DELETE',
            url: "/api/users",
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
            this.setState({isLoadingButton: true});
            const data = this.state.items.filter((e) => e.id == this.state.selectedItems[0]);
            const formData = {
                id: data[0].id,
                email: this.state.email,
                password: this.state.password
            };
            axios({
                method: "POST",
                url: "/api/users/edit",
                data: formData
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
                email: data[0].email
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
      this.setState({active: e.value});
      // console.log(e.value);
    }

    dataListRender() {
      axios({
        method: "POST",
        url: `/api/users/all`,
        data: {limit: this.state.selectedPageSize, offset: (this.state.currentPage - 1) * this.state.selectedPageSize}
      }).then((res) => {
        this.setState({
              totalPage: Math.ceil(res.data.totalPages),
              // totalPage: 4,
              items: res.data.message,
              selectedItems:[],
              totalItemCount: res.data.message.length,
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
                  <h1 className="mb-n5">
                    Users
                  </h1>

                  <div className="float-sm-right">
                    <Button
                      color="primary"
                      size="lg"
                      className="top-right-button"
                      onClick={this.toggleModal}
                    >
                      ADD USER
                    </Button>
                    {"  "}

                    <Modal
                      isOpen={this.state.modalOpen}
                      toggle={this.toggleModal}
                      wrapClassName="modal-right"
                      backdrop="static"
                    >
                      <ModalHeader toggle={this.toggleModal}>
                        {(this.state.isEditMode ? "Edit User" : "Add User")}
                      </ModalHeader>
                      <ModalBody>
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
                        {/* <Label className="mt-4">
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
                          name="active"
                          options={this.state.activeValues} /> */}
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
                        {/* {(this.state.edit == false ?

                        :)} */}

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
                </div>
<br />
              </Colxx>
            </Row>


            
          <Colxx xxs="12">
            <Card className="mb-4">
              <CardBody>

                <Table striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      {/* <th>Username</th>
                      <th>Active</th> */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.items.map((product, index) => {
                    return (
                        <tr onClick={event =>
                            this.handleCheckChange(event, product.id)
                          }>
                            <th scope="row">{index +1}</th>
                            <td>{product.email}</td>
                            {/* <td><Badge color={product.statusColor} pill>{product.active}</Badge></td> */}
                            <td><CustomInput
                                className="itemCheck mb-0"
                                type="checkbox"
                                id={`check_${product.id}`}
                                checked={this.state.selectedItems.includes(
                                  product.id
                                )}
                                onChange={() => {}}
                                label=""
                              /></td>
                        </tr>
                    )
                  })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Colxx>


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
