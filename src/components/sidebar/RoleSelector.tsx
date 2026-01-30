import CreatableSelect from 'react-select/creatable'
import type { GroupBase } from 'react-select'
import { ROLE_OPTIONS } from '../../constants/roles'
import { useAppStore } from '../../store'
import type { RoleOption } from '../../types'
import { cn } from '../../lib/cn'

export function RoleSelector() {
  const selectedRoles = useAppStore((s) => s.selectedRoles)
  const setSelectedRoles = useAppStore((s) => s.setSelectedRoles)

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-muted">
        Seasoning
      </label>
      <CreatableSelect<RoleOption, true, GroupBase<RoleOption>>
        isMulti
        options={ROLE_OPTIONS}
        value={selectedRoles}
        onChange={(newValue) => setSelectedRoles([...newValue])}
        onCreateOption={(inputValue) => {
          const newRole: RoleOption = {
            value: inputValue.toLowerCase().replace(/\s+/g, '-'),
            label: inputValue,
            group: 'Custom',
          }
          setSelectedRoles([...selectedRoles, newRole])
        }}
        placeholder={`Role assignments ("Act as a...")`}
        formatCreateLabel={(input) => `Add role: "${input}"`}
        unstyled
        classNames={{
          control: ({ isFocused }) =>
            cn(
              'rounded-lg border bg-surface-alt px-3 py-2 text-sm min-h-[38px]',
              isFocused
                ? 'border-primary ring-1 ring-primary'
                : 'border-border',
            ),
          valueContainer: () => 'gap-1 flex flex-wrap',
          menu: () =>
            'mt-1 rounded-lg border border-border bg-surface-alt shadow-lg overflow-hidden',
          menuList: () => 'max-h-60 overflow-y-auto py-1',
          groupHeading: () =>
            'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted',
          option: ({ isFocused, isSelected }) =>
            cn(
              'px-3 py-2 text-sm cursor-pointer transition-colors',
              isFocused && 'bg-primary/10',
              isSelected && 'text-primary font-medium',
            ),
          multiValue: () =>
            'bg-primary/20 text-primary rounded-md px-2 py-0.5 text-xs font-medium',
          multiValueLabel: () => '',
          multiValueRemove: () =>
            'ml-1 hover:text-danger cursor-pointer opacity-70 hover:opacity-100',
          placeholder: () => 'text-text-muted/60',
          input: () => 'text-text text-sm',
          noOptionsMessage: () => 'px-3 py-2 text-sm text-text-muted',
          clearIndicator: () =>
            'text-text-muted hover:text-text cursor-pointer p-1',
          dropdownIndicator: () =>
            'text-text-muted hover:text-text cursor-pointer p-1',
          indicatorSeparator: () => 'bg-border mx-1 self-stretch w-px',
        }}
      />
    </div>
  )
}
