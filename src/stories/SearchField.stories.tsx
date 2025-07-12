import type { Meta, StoryObj } from '@storybook/react-vite'
import SearchField from '../components/UI/SearchField'

const meta: Meta<typeof SearchField> = {
    title: 'UI/SearchField',
    component: SearchField,
    tags: ['autodocs'],
    args: {
        value: '',
        onChange: () => { },
    },
}
export default meta

type Story = StoryObj<typeof SearchField>

export const Default: Story = {}

export const WithValue: Story = {
    args: {
        value: 'Jazz',
    },
}

export const Disabled: Story = {
  render: (args) => (
    <SearchField
      {...args}
      value="Disabled"
      onChange={() => {}}
    />
  ),
}