import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Availabilities from '../pages/Availabilities'
import { mount } from 'enzyme'

const availabilities =  [
  {
    id: 1,
    firstName: "fernando",
    lastName: "fonzu",
    email: "mandrid@yahoo.com",
    phone: "619-244-3434"
  },
  {
    id: 2,
    firstName: "orlando",
    lastName: "fuji",
    email: "landri@yahoo.com",
    phone: "619-244-2334"
  },
  {
    id: 3,
    firstName: "bob",
    lastName: "tonhy",
    email: "bob21@yahoo.com",
    phone: "619-244-2112"
  },
]

it('Availabilities renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Availabilities />, div)
})

it('Renders the availabilities', () => {
  const component = mount(<Availabilities availabilities={availabilities} />)
  const headings = component.find('h4 > .availabilities-firstName')
  expect(headings.length).toBe(3)
})
