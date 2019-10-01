import React, { Component } from 'react';


export default class UpdateCourse extends Component {
    state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        User: {},
        errors: [],
    }

    // Call getCourses method to fetch a list of courses
    // when the component is mounted.
    componentDidMount() {
        this.getCourseDetail();
    }

    render () {
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            User,
            errors
        } = this.state;

        return (
            <div className="bounds course--detail">
                <h1>Update Course</h1>
                <div>
                    {errors && errors.length > 0 ? <h2 className="validation--errors--label">Validation errors</h2>:''}
                    <div className="validation-errors">
                    <ul>
                        {(errors || []).map( (error, index) => <li key={index}>{error}</li>)}
                    </ul>
                </div>
                <form onSubmit={this.submit}>
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <div>
                                <input 
                                    id="title" 
                                    name="title" 
                                    type="text" 
                                    className="input-title course--title--input" 
                                    placeholder="Course title..." 
                                    value={title}
                                    onChange={this.change} />

                            </div>
                            <p>By {User ? (`${User.firstName} ${User.lastName}`) : ''}</p>
                        </div>
                        <div className="course--description">
                            <div>
                                <textarea id="description" name="description" className="" placeholder="Course description..." value={description} onChange={this.change}>High-end furniture projects are great to dream about. But unless you have a well-equipped shop and some serious woodworking experience to draw on, it can be difficult to turn the dream into a reality.</textarea>
                            </div>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <div>
                                        <input 
                                            id="estimatedTime" 
                                            name="estimatedTime" 
                                            type="text" 
                                            className="course--time--input"
                                            placeholder="Hours" 
                                            value={estimatedTime ? estimatedTime : ''}
                                            onChange={this.change} />
                                    </div>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <div>
                                        <textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={materialsNeeded ? materialsNeeded : ''} onChange={this.change}></textarea>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="grid-100 pad-bottom">
                        <button className="button" type="submit">Update Course</button>
                        <button className="button button-secondary" onClick={this.cancel}>Cancel</button>
                    </div>
                </form>
                </div>
            </div>
        );
    }

    change = (e) => {
        const {target: { name, value }} = e;
        this.setState(() => {
          return {
            [name]: value
          };
        });
    }

    submit = (e) => {
        e.preventDefault(e);
        const { context } = this.props;
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
        } = this.state;

        const userId = context.authenticatedUser.userId;
        const body = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId,
        };
        
        this.updateCourse(body, this.props.match.params.id);
    }

    cancel = (e) => {
        e.preventDefault(e); 
        this.props.history.push(`/courses/${this.state.id}`);
    }

    //UPDATE course.
    updateCourse = async (body, id) => {
        const url = `/courses/${id}`;

        const { context } = this.props;
        const { emailAddress } = context.authenticatedUser;
        const password = context.userPassword;
        const response = await context.data.api(url, 'PUT', body, true, {emailAddress, password});

        if (response.status === 204) {
            this.props.history.push(`/courses/${id}`);
        } else if (response.status === 403) {
            this.props.history.push('/forbidden');
        }   else if (response.status === 400) {
            response.json().then(data => {
                this.setState({
                    errors: data.errors,
                })
            });
        } else if (response.status === 500) {
            this.props.history.push(`/error`);
        }
        else {
            throw new Error();
        }
    }

    //FETCH course details.
    getCourseDetail = async (id = this.props.match.params.id) => {
        const url = `/courses/${id}`; //'http://localhost:5000/api/courses/'
        const { context } = this.props;
        const response = await context.data.api(url);

        if(response.status === 200) {
            response.json().then(course => {
                if(context.authenticatedUser.userId === course.userId) {
                    this.setState({...course}); 
                } else {
                    this.props.history.push('/forbidden');
                }
                  
            });
        } else if (response.status === 400) {
            this.props.history.push(`/notfound`);
        } else if (response.status === 500) {
            this.props.history.push(`/error`);
        } else {
            throw new Error();
        }
    }
}

