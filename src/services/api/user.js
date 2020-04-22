import axios from 'axios'

// object literal
export default {
  // returns some basic endpoints
  userBaseInitialize () {
    return axios.get('/')
  },

  // returns data for navigation
  userInitialize () {
    return axios.get('/_root')
  },

  // returns approval tasks that are assigned to the user trhough workflows
  userGetInbox () {
    return axios.get('/user/inbox')
  },

  // returns profile information of user
  userGetProfile () {
    return axios.get('/user/profile')
  },
  userGetProfileMeta () {
    return axios.get('/meta/profile')
  },

  // change password
  userChangePassword (credentials) {
    return axios.patch(`/user/change_password`, {
      'password': credentials.oldPassword,
      'password_new': credentials.newPassword,
      'password_new_verification': credentials.newPasswordConfirm
    })
  },

  // manage security questions
  userGetQuestions (oldPassword, newPassword, newPasswordConfirm) {
    return axios.get('/user/profile_questions')
  },
  userChangeQuestions (questions, answers, password) {
    return axios.patch(`/user/change_questions`, {
      'question_one': questions[0],
      'question_two': questions[1],
      'question_three': questions[2],
      'answer_one': answers[0],
      'answer_two': answers[1],
      'answer_three': answers[2],
      'password': password
    })
  },

  // manage timezone
  userGetTimezoneMeta () {
    return axios.get('meta/set_timezone')
  },
  userPatchTimezone (timezone) {
    return axios.patch('/user/profile/loc.timezone', {
      'value': timezone
    })
  },

  // manage language
  userGetLanguageMeta () {
    return axios.get('/meta/set_language')
  },
  userPatchLanguage (language) {
    return axios.patch('/user/profile/loc.language', {
      'value': language
    })
  },

  /*
  * manage dynamic GUI options
  * including darkMode, Pagination, dense
  */
  userGetGuiOptionMeta (instance) {
    return axios.get(`/user/profile/gui.${instance}`)
      .then(response => {
        return response.data
      })
  },
  userPatchGuiOption (instance, payload) {
    return axios.patch(`/user/profile/loc.${instance}`, payload)
      .then(response => {
        return response.data
      })
  }

  // request_password_reset_email
  // password_reset_email/<str:token>

}
