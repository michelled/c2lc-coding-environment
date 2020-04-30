// @flow

import React from 'react';
import CommandBlock from './CommandBlock';
import { injectIntl } from 'react-intl';

type CommandPaletteCommandProps = {
    commandName: string,
    intl: any,
    selectedCommandName: ?string,
    onChange: (commandName: ?string) => void
};

class CommandPaletteCommand extends React.Component<CommandPaletteCommandProps, {}> {
    handleClick = () => {
        this.props.onChange(
            this.props.commandName === this.props.selectedCommandName ? null : this.props.commandName
        );
    };

    render() {
        const pressed = this.props.commandName === this.props.selectedCommandName;

        const ariaLabel = this.props.intl.formatMessage({
            id: `CommandPaletteCommand.${this.props.commandName}`
        });

        return (
            <CommandBlock
                commandName={this.props.commandName}
                className={pressed ? 'command-block--pressed' : undefined}
                aria-label={ariaLabel}
                aria-pressed={pressed}
                onClick={this.handleClick}
                disabled={false}>
            </CommandBlock>
        )
    }
}

export default injectIntl(CommandPaletteCommand);
