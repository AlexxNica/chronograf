import React, {PropTypes} from 'react'

import _ from 'lodash'
import classnames from 'classnames'

import UserEditName from 'src/admin/components/UserEditName'
import UserNewPassword from 'src/admin/components/UserNewPassword'
import MultiSelectDropdown from 'shared/components/MultiSelectDropdown'
import ConfirmButtons from 'shared/components/ConfirmButtons'
import DeleteConfirmTableCell from 'shared/components/DeleteConfirmTableCell'
import ChangePassRow from 'src/admin/components/ChangePassRow'
import {USERS_TABLE} from 'src/admin/constants/tableSizing'
import {INFLUX_ENTERPRISE} from 'shared/constants/index'

const UserRow = ({
  user: {name, roles = [], permissions, password},
  user,
  isNew,
  onEdit,
  onSave,
  source,
  allRoles,
  onCancel,
  onDelete,
  isEditing,
  onUpdateRoles,
  allPermissions,
  onUpdatePassword,
  onUpdatePermissions,
}) => {
  const handleUpdatePermissions = perms => {
    const allowed = perms.map(p => p.name)
    onUpdatePermissions(user, [{scope: 'all', allowed}])
  }

  const handleUpdateRoles = roleNames => {
    onUpdateRoles(
      user,
      allRoles.filter(r => roleNames.find(rn => rn.name === r.name))
    )
  }

  const handleUpdatePassword = () => {
    onUpdatePassword(user, password)
  }

  const perms = _.get(permissions, ['0', 'allowed'], [])

  if (isEditing) {
    return (
      <tr className="admin-table--edit-row">
        <UserEditName user={user} onEdit={onEdit} onSave={onSave} />
        <UserNewPassword
          user={user}
          onEdit={onEdit}
          onSave={onSave}
          isNew={isNew}
        />
        {source.type === INFLUX_ENTERPRISE &&
          <td className="admin-table--left-offset">--</td>}
        <td className="admin-table--left-offset">--</td>
        <td
          className="text-right"
          style={{width: `${USERS_TABLE.colDelete}px`}}
        >
          <ConfirmButtons
            item={user}
            onConfirm={onSave}
            onCancel={onCancel}
            buttonSize="btn-xs"
          />
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td style={{width: `${USERS_TABLE.colUsername}px`}}>
        {name}
      </td>
      <td style={{width: `${USERS_TABLE.colPassword}px`}}>
        <ChangePassRow
          onEdit={onEdit}
          onApply={handleUpdatePassword}
          user={user}
          buttonSize="btn-xs"
        />
      </td>
      {source.type === INFLUX_ENTERPRISE &&
        <td>
          <MultiSelectDropdown
            items={allRoles}
            selectedItems={roles.map(r => ({name: r.name}))}
            label={roles.length ? '' : 'Select Roles'}
            onApply={handleUpdateRoles}
            buttonSize="btn-xs"
            buttonColor="btn-primary"
            customClass={classnames(`dropdown-${USERS_TABLE.colRoles}`, {
              'admin-table--multi-select-empty': !roles.length,
            })}
          />
        </td>}
      <td>
        {allPermissions && allPermissions.length
          ? <MultiSelectDropdown
              items={allPermissions.map(p => ({name: p}))}
              selectedItems={perms.map(p => ({name: p}))}
              label={
                permissions && permissions.length ? '' : 'Select Permissions'
              }
              onApply={handleUpdatePermissions}
              buttonSize="btn-xs"
              buttonColor="btn-primary"
              customClass={classnames(
                `dropdown-${USERS_TABLE.colPermissions}`,
                {
                  'admin-table--multi-select-empty': !permissions.length,
                }
              )}
            />
          : null}
      </td>
      <DeleteConfirmTableCell
        onDelete={onDelete}
        item={user}
        buttonSize="btn-xs"
      />
    </tr>
  )
}

const {arrayOf, bool, func, shape, string} = PropTypes

UserRow.propTypes = {
  user: shape({
    name: string,
    roles: arrayOf(
      shape({
        name: string,
      })
    ),
    permissions: arrayOf(
      shape({
        name: string,
      })
    ),
    password: string,
  }).isRequired,
  source: shape({
    type: string.isRequired,
  }),
  allRoles: arrayOf(shape()),
  allPermissions: arrayOf(string),
  isNew: bool,
  isEditing: bool,
  onCancel: func,
  onEdit: func,
  onSave: func,
  onDelete: func.isRequired,
  onUpdatePermissions: func,
  onUpdateRoles: func,
  onUpdatePassword: func,
}

export default UserRow
