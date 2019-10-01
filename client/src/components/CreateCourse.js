import React, {Component} from 'react';

export default class CreateCourse extends Component {
    state = {
        title: '',
        description: '',
        errors: [], // if error comes from server, it will set to this state
    }

    render () {
        const {
            title,
            estimatedTime,
            errors,
        } = this.state;

        const { authenticatedUser } = this.props.context;

        return (
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <div>
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
                                <p>By { authenticatedUser ? (`${authenticatedUser.firstName} ${authenticatedUser.lastName}`) : ''}</p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea 
                                        id="description" 
                                        name="description" 
                                        className="" 
                                        placeholder="Course description..." 
                                        onChange={this.change}/>
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
                                                value={estimatedTime} 
                                                onChange={this.change}
                                                />
                                        </div> 
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <textarea 
                                                id="materialsNeeded" 
                                                name="materialsNeeded" 
                                                className="" 
                                                placeholder="List materials..."
                                                onChange={this.change} />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="grid-100 pad-bottom">
                            <button className="button" type="submit">Create Course</button>
                            <button className="button button-secondary" onClick={this.cancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    cancel = (e) => {
        e.preventDefault(); 
        this.props.history.push('/');
    }

    submit = (e) => {
        e.preventDefault();
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
        
        this.createCourse(body);
    }

    change = (e) => {
        const {target: { name, value }} = e;
        this.setState(() => {
          return {
            [name]: value
          };
        });
    }

    //CREATE a course.
    createCourse = async (body) => {
        const url = '/courses';
        const { context } = this.props;
        const { emailAddress } = context.authenticatedUser;
        const password = context.userPassword;
        const response = await context.data.api(url, 'POST', body, true, {emailAddress, password});

        if (response.status === 201) {
            const location = await response.headers.get('Location');
            const id = location.replace('/api/courses/', '');
            this.props.history.push(`/courses/${id}`);
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