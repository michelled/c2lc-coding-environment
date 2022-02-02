// @flow

import {createIntl} from 'react-intl';
import {App} from './App';
import AudioManagerImpl from './AudioManagerImpl';
import {ProgramBlockEditor} from './ProgramBlockEditor';
import ProgramChangeController from './ProgramChangeController';
import ProgramSequence from './ProgramSequence';
import messages from './messages.json';

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

jest.mock('./App');
jest.mock('./AudioManagerImpl');
jest.mock('./ProgramBlockEditor');

function createProgramChangeController() {
    // $FlowFixMe: Jest mock API
    App.mockClear();
    // $FlowFixMe: Jest mock API
    AudioManagerImpl.mockClear();

    // $FlowFixMe: Jest mock API
    const controller = new ProgramChangeController(new App(), intl, new AudioManagerImpl());

    // $FlowFixMe: Jest mock API
    const appMock = App.mock.instances[0];
    // $FlowFixMe: Jest mock API
    const audioManagerMock = AudioManagerImpl.mock.instances[0];

    return {
        controller,
        appMock,
        audioManagerMock
    };
}

describe('Test insertSelectedActionIntoProgram()', () => {
    test('When there is a selectedAction, then the program should be updated and all expected activities invoked', (done) => {
        expect.assertions(10);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward'}, {block: 'forward2'}], 0, 0)
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(
                [{block: 'forward'}, {block: 'forward3'}, {block: 'forward2'}]);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('add');
            expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                command: 'forward 3 squares'
            });

            // The focus, scrolling, and animation should be set up
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls[0][0]).toBe(2);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls[0][0]).toBe(1);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.insertSelectedActionIntoProgram(new ProgramBlockEditor(), 1,
            'forward3');
    });

    test('When there is no selectedAction, then no changes should be made', (done) => {
        expect.assertions(5);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([], 0, 0)
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // No announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);

            // No methods on the ProgramBlockEditor should have been called
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(0);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.insertSelectedActionIntoProgram(new ProgramBlockEditor(), 0, null);
    });
});

describe('Test addSelectedActionToProgramEnd()', () => {
    test('When there is a selectedAction, then the program should be updated and all expected activities invoked', (done) => {
        expect.assertions(10);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward'}, {block: 'forward2'}], 0, 0)
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(
                [{block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}]);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('add');
            expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                command: 'forward 3 squares'
            });

            // The focus, scrolling, and animation should be set up
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(2);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls[0][0]).toBe(3);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls[0][0]).toBe(2);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.addSelectedActionToProgramEnd(new ProgramBlockEditor(), 'forward3');
    });

    test('When there is no selectedAction, then no changes should be made', (done) => {
        expect.assertions(5);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward'}, {block: 'forward2'}], 0, 0)
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // No announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);

            // No methods on the ProgramBlockEditor should have been called
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(0);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.addSelectedActionToProgramEnd(new ProgramBlockEditor(), null);
    });
});

describe('Test deleteProgramStep()', () => {
    test('When deleting a step not at the end, then focus is set to the step now at the deleted index', (done) => {
        expect.assertions(7);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward'}, {block: 'forward2'}], 0, 0)
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(
                [{block: 'forward2'}]);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('delete');
            expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                command: 'forward 1 square'
            });

            // The command block should be focused
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(0);
            expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls.length).toBe(0);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.deleteProgramStep(new ProgramBlockEditor(), 0, 'forward');
    });

    test('When deleting the step at the end, then focus is set to the add-node after the program', (done) => {
        expect.assertions(7);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward'}, {block: 'forward2'}], 0, 0)
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(
                [{block: 'forward'}]);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('delete');
            expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                command: 'forward 2 squares'
            });

            // The add-node after the program should be focused
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls[0][0]).toBe(1);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.deleteProgramStep(new ProgramBlockEditor(), 1, 'forward2');
    });

    test('When the step to delete has changed, then no changes to the program should be made', (done) => {
        expect.assertions(4);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward'}, {block: 'forward2'}], 0, 0)
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // No announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);

            // No methods on the ProgramBlockEditor should have been called
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls.length).toBe(0);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.deleteProgramStep(new ProgramBlockEditor(), 1, 'forward3');
    });

});
