import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
import ModalActions from '../components/UI/ModalActions'

const meta: Meta<typeof ModalActions> = {
    title: 'UI/ModalActions',
    component: ModalActions,
    tags: ['autodocs'],
    args: {
        disabled: false,
        isLoading: false,
        idleLabel: 'Save',
        loadingLabel: 'Saving…',
        onCancel: () => { },
    },
}
export default meta

type Story = StoryObj<typeof ModalActions>

export const Default: Story = {}

export const Loading: Story = {
    args: {
        isLoading: true,
    },
}

export const Disabled: Story = {
    args: {
        disabled: true,
    },
}

export const Interactive: Story = {
    render: (args) => {
        const [loading, setLoading] = useState(false)
        return (
            <ModalActions
                {...args}
                isLoading={loading}
                onCancel={() => setLoading(!loading)}
            />
        )
    },
}