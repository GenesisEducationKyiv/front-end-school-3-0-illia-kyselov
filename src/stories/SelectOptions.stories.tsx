import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
import SelectOptions from '../components/UI/SelectOptions'

const options = [
    { value: 'jazz', label: 'Jazz' },
    { value: 'rock', label: 'Rock' },
    { value: 'pop', label: 'Pop' },
    { value: 'electronic', label: 'Electronic' },
]

const meta: Meta<typeof SelectOptions> = {
    title: 'UI/SelectOptions',
    component: SelectOptions,
    tags: ['autodocs'],
    args: {
        options,
        selectedValue: 'jazz',
        onSelect: () => { },
    },
}
export default meta

type Story = StoryObj<typeof SelectOptions>

export const Default: Story = {}

export const Interactive: Story = {
    render: (args) => {
        const [selected, setSelected] = useState('jazz')
        return (
            <div style={{ position: 'relative', width: 240 }}>
                <SelectOptions
                    {...args}
                    selectedValue={selected}
                    onSelect={setSelected}
                />
            </div>
        )
    },
}