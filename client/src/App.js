import React from 'react';
import Error from './components/Error';
import Forbidden from './components/Forbidden';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import NotFound from './components/NotFound';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import Authenticated from './components/Authenticated';
import withContext from './Context';
import PrivateRoute from './PrivateRoute';
import CourseDetail from './components/CourseDetail';
import UpdateCourse from './components/UpdateCourse';
import CreateCourse from './components/CreateCourse';
import Courses from './components/Courses';
import './styles/global.css'

const HeaderWithContext = withContext(Header);
const AuthWithContext = withContext(Authenticated);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CreateCourseWithContext = withContext(CreateCourse);
const CourseDetailWithContext = withContext(CourseDetail);
// const CoursesWithContext = withContext(Courses);
const ForbiddenWithContext = withContext(Forbidden);
const ErrorWithContext = withContext(Error);

export default () => (
  <Router>
    <div>
      <HeaderWithContext />
      <Switch>
        <Route exact path="/" component={Courses} />
        <PrivateRoute path='/courses/create' component={CreateCourseWithContext} />
        <PrivateRoute path='/courses/:id/update' component={UpdateCourseWithContext} />
        <PrivateRoute path="/authenticated" component={AuthWithContext} />
        <Route path='/courses/:id' component={CourseDetailWithContext} /> 
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route path="/forbidden" component={ForbiddenWithContext} />
        <Route path="/error" component={ErrorWithContext} />
        <Route path="/notfound" component={NotFound} />
      </Switch>
    </div>
  </Router>
);
