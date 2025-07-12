import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
import Checkbox from '../components/UI/Checkbox'

const meta: Meta<typeof Checkbox> = {
    title: 'UI/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    args: {
        checked: false,
        onChange: () => { },
    },
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {}

export const Checked: Story = {
    args: {
        checked: true,
    },
}

export const Interactive: Story = {
    render: (args) => {
        const [checked, setChecked] = useState(false)
        return (
            <Checkbox
                {...args}
                checked={checked}
                onChange={setChecked}
                testId="storybook-checkbox"
            />
        )
    },
}