# Ansible Cisco NX-OS Operational Data Collection

A production-quality, **READ-ONLY** Ansible project for collecting operational information from Cisco Nexus NX-OS switches.

## ⚠️ Important Security Notice

This project is strictly **READ-ONLY**. It will:
- ❌ NOT configure any device
- ❌ NOT reload or reboot devices
- ❌ NOT save configurations
- ❌ NOT copy files to devices
- ❌ NOT enable features
- ❌ NOT change any network device state

All operations use `show` commands only.

## Project Architecture

```
ansible-cisco-nxos/
├── ansible.cfg              # Ansible configuration
├── requirements.yml         # Required collections
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── inventories/
│   └── lab/
│       ├── hosts.yml       # Lab inventory
│       └── group_vars/
│           └── nxos.yml    # NX-OS group variables
├── playbooks/
│   └── collect_nxos_operational_data.yml  # Main playbook
├── output/                 # Generated output directory
│   └── .gitkeep
└── tests/
    └── README.md          # Test documentation
```

## Requirements

### Software Requirements

- Ansible >= 2.15
- Python >= 3.9
- Linux control node (recommended)

### Required Collections

- `cisco.nxos` >= 5.0.0
- `ansible.netcommon` >= 6.0.0

## Collection Installation

Install required collections:

```bash
ansible-galaxy collection install -r requirements.yml
```

Or install individually:

```bash
ansible-galaxy collection install cisco.nxos ansible.netcommon
```

## Environment Variables

Credentials are loaded from environment variables. **Never hard-code credentials.**

Set the following environment variables before running:

```bash
export NXOS_USERNAME="your_username"
export NXOS_PASSWORD="your_password"
```

### Credential Security

- Credentials are read at runtime using `ansible.builtin.env` lookup
- No credentials are stored in version control
- No credentials appear in logs (no_log is enabled where appropriate)
- Consider using Ansible Vault for production environments with encrypted credential files

## Inventory Format

The inventory uses YAML format with a `nxos` group:

```yaml
all:
  children:
    nxos:
      hosts:
        nexus-leaf-01:
          ansible_host: 192.0.2.11
        nexus-leaf-02:
          ansible_host: 192.0.2.12
```

**Note:** The IP addresses `192.0.2.11` and `192.0.2.12` are documentation-only dummy addresses (RFC 5737 TEST-NET-1). Replace with your actual management IPs in your environment.

## Syntax Validation

Validate the project before use:

```bash
# Check inventory syntax
ansible-inventory -i inventories/lab/hosts.yml --graph

# Check playbook syntax
ansible-playbook --syntax-check -i inventories/lab/hosts.yml playbooks/collect_nxos_operational_data.yml

# Run ansible-lint for best practices
ansible-lint playbooks/collect_nxos_operational_data.yml
```

## Dry-Run Limitations for Network Modules

The `--check` (dry-run) mode has limited usefulness with network modules:

- `cisco.nxos.nxos_facts` and `cisco.nxos.nxos_command` do not support check mode
- These modules always execute against devices when run
- Use syntax checking (`--syntax-check`) instead of dry-run for validation

## How to Execute the Playbook

1. Set environment variables:
   ```bash
   export NXOS_USERNAME="admin"
   export NXOS_PASSWORD="SecurePassword123"
   ```

2. Run the playbook:
   ```bash
   ansible-playbook -i inventories/lab/hosts.yml playbooks/collect_nxos_operational_data.yml
   ```

3. Output will be saved to:
   ```
   output/<hostname>/<timestamp>/
   ```

## Expected Output Structure

After execution, output files are organized as:

```
output/
└── nexus-leaf-01/
    └── 20240115_143022/
        ├── facts.yml           # Collected NX-OS facts
        ├── command_output.yml  # All command outputs
        ├── failures.yml        # Any failed commands
        └── summary.yml         # Collection summary
```

### Output Files

| File | Description |
|------|-------------|
| `facts.yml` | Structured facts from `nxos_facts` module |
| `command_output.yml` | Raw output from all show commands |
| `failures.yml` | Details of any failed optional commands |
| `summary.yml` | Collection metadata and statistics |

## Why Test in a Lab First

Always test this project in a lab environment before production use because:

1. **Network Variability**: Different NX-OS versions may have different command outputs
2. **Feature Availability**: Optional features (vPC, EVPN) may not be enabled
3. **Timeout Settings**: May need adjustment for your network latency
4. **Credential Validation**: Ensure SSH access works correctly
5. **Output Parsing**: Verify output format matches expectations

## Cloud Connectivity Limitations

**Qwen cloud or any cloud-based AI cannot reach private management addresses** because:

- Private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are not routable from the internet
- Network devices typically have management interfaces on isolated networks
- Firewalls block external access to management planes
- This project must run from a control node with direct network access to devices

## Running from a Linux Ansible Control Node

To run this project:

1. **Prepare the control node**:
   ```bash
   # Install Ansible
   pip install ansible
   
   # Install required collections
   ansible-galaxy collection install -r requirements.yml
   ```

2. **Clone or copy the project**:
   ```bash
   cd /path/to/ansible-cisco-nxos
   ```

3. **Configure inventory** with your device IPs in `inventories/lab/hosts.yml`

4. **Set credentials**:
   ```bash
   export NXOS_USERNAME="admin"
   export NXOS_PASSWORD="your_secure_password"
   ```

5. **Validate**:
   ```bash
   ansible-playbook --syntax-check -i inventories/lab/hosts.yml playbooks/collect_nxos_operational_data.yml
   ```

6. **Execute**:
   ```bash
   ansible-playbook -i inventories/lab/hosts.yml playbooks/collect_nxos_operational_data.yml
   ```

## License

MIT License - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run validation tests
5. Submit a pull request

## Support

This project is provided as-is for educational and operational purposes. For Cisco NX-OS support, contact Cisco TAC.
