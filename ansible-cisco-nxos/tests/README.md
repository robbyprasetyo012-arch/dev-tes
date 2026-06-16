# Tests Directory

This directory is reserved for test files and test documentation.

## Testing Guidelines

### Unit Testing
- Test playbooks with `--syntax-check` before execution
- Use `ansible-lint` for code quality validation
- Validate inventory with `ansible-inventory --graph`

### Integration Testing
- Always test in a lab environment first
- Verify read-only behavior before production use
- Test with various NX-OS versions

### Validation Commands

```bash
# Syntax check
ansible-playbook --syntax-check -i inventories/lab/hosts.yml playbooks/collect_nxos_operational_data.yml

# Lint check
ansible-lint playbooks/collect_nxos_operational_data.yml

# Inventory validation
ansible-inventory -i inventories/lab/hosts.yml --graph
```

## Test Plans

1. **Syntax Validation**: Ensure all YAML files are valid
2. **Inventory Validation**: Verify host and group definitions
3. **Variable Precedence**: Confirm group_vars are applied correctly
4. **Credential Loading**: Test environment variable lookups
5. **Output Generation**: Verify output file structure (requires live devices)

## Notes

- Do not store real device credentials in test files
- Use documentation IP addresses (192.0.2.0/24) for examples
- Mock data can be used for testing output processing logic
