import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Disclaimer from '../Disclaimer.vue'

describe('Disclaimer', () => {
  it('renders properly', () => {
    const wrapper = mount(Disclaimer, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('This web app is provided')
  })
})
