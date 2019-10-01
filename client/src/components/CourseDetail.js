import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

//Retrieve a course detail from Rest API's /api/courses/:id route
//render A course from /api/courses/:id route
//render the 'Delete Course' button
//on click, send Delete request to /api/courses/:id to delete

export default class CourseDetail extends Component {
    constructor() {
        super();
        this.state = {
          data: [],
          course: null,
          errors: [],
        };
      }

    //GET COURSE DETAILS at component mount.
    componentDidMount() {
        //Get api courses when mounted
        let id = this.props.match.params.id
        axios
          .get(`http://localhost:5000/api/courses/${id}`)
          .then(response => {
            this.setState({
              course: response.data
            });
          })
          .catch(error => {
            console.log("Error fetching data", error);
            if (error === "Error: Request failed with status code 500") {
              window.location.href = "/error";
            }
          });
      }

    //RENDERING LOGIC: Checks for authenticated user w/matching userID and return the update and delete course buttons IF authenticated.
    render() {
        const { course, errors } = this.state;
        const { authenticatedUser } = this.props.context;
        let authButton = '';

        if(course && authenticatedUser) {
            if(course.User.id === authenticatedUser.userId) {
                authButton = <React.Fragment>
                                <Link className="button" to={course ? `/courses/${course.id}/update/` : ''}>Update Course</Link>
                                <button className="button" onClick={()=>{this.deleteCourse(course.id)}}>Delete Course</button>
                            </React.Fragment>
            }
        }

        return (
            <div>
                <div className="actions--bar">;
                    <div className="bounds">
                        <div className="grid-100">
                            <span>
                                { authButton }
                            </span>
                        <Link className="button button-secondary" to="/">Return to List</Link></div>
                                
                    </div>
                </div>

                <div className="bounds course--detail">
                    <div className="grid-66">
                        {course ? '' : <h1>Loading.....</h1>}
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{course ? course.title : ''}</h3>
                            <p>By {course ? (`${course.User.firstName} ${course.User.lastName}`) : ''}</p>
                        </div>
                        <div className="course--description">
                            {course ? <ReactMarkdown source={course.description} /> : ''}
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <h3>{course ? course.estimatedTime || 'N/A' : ''}</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    {course ? <ReactMarkdown source={course.materialsNeeded || "N/A"} /> : ''}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    
    //FETCH COURSES
    getCourseDetail = async (id = this.props.match.params.id) => {
        const url = 'http://localhost:5000/api/courses/';
        const response = await this.props.context.data.api(url + id);

        if(response.status === 200) {
            response.json().then(data => this.setState({course: data}));
        } else if (response.status === 400) {
            this.props.history.push(`/notfound`);
        } else if (response.status === 500) {
            this.props.history.push(`/error`);
        } else {
            throw new Error();
        }
    }

    //DELETE COURSES
    deleteCourse = async (id = this.props.match.params.id) => {
        const url = `http://localhost:5000/api/courses/${id}`;
        const { context } = this.props;
        const { emailAddress } = context.authenticatedUser;
        const password = context.userPassword;
        const response = await context.data.api(url, 'DELETE', null, true, {emailAddress, password});

        if (response.status === 204) {
            this.props.history.push(`/`);
        } else if (response.status === 400) {
            response.json().then(data => {
                this.setState({
                    errors: data.errors,
                })
            });
        } else if (response.status === 500) {
            this.props.history.push(`/error`);
        } else {
            throw new Error();
        }
    }
}