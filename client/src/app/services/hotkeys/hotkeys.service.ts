// Tutoriel and code by Ben Nadel
// https://www.bennadel.com/blog/3382-handling-global-keyboard-shortcuts-using-priority-and-terminality-in-angular-5-0-5.htm

import {Injectable, NgZone } from '@angular/core';

type Terminal = boolean | 'match';

interface ListenerOptions {
  priority: number;
  terminal?: Terminal;
  terminalWhitelist?: string[];
  inputs?: boolean;
}

interface Listener {
  priority: number;
  terminal: Terminal;
  terminalWhitelist: TerminalWhitelist;
  inputs: boolean;
  bindings: Bindings;
}

type Handler = ( event: KeyboardEvent )  => boolean | void;

interface Bindings {
  [ key: string ]: Handler;
}

interface NormalizedKeys {
  [ key: string ]: string;
}

interface TerminalWhitelist {
  [ key: string ]: boolean;
}

export type Unlisten = ()  => void;

const KEY_MAP: {[k: string]: string} = {
  '\b': 'Backspace',
  '\t': 'Tab',
  '\x7F': 'Delete',
  '\x1B': 'Escape',
  'Del': 'Delete',
  'Esc': 'Escape',
  'Left': 'ArrowLeft',
  'Right': 'ArrowRight',
  'Up': 'ArrowUp',
  'Down': 'ArrowDown',
  'Menu': 'ContextMenu',
  'Scroll': 'ScrollLock',
  'Win': 'OS',
  ' ': 'Space',
  '.': 'Dot'
};

const KEY_ALIAS: {[k: string]: string} = {
  command: 'meta',
  ctrl: 'control',
  del: 'delete',
  down: 'arrowdown',
  esc: 'escape',
  left: 'arrowleft',
  right: 'arrowright',
  up: 'arrowup'
};

@Injectable({
  providedIn: 'root'
})

export class HotkeysService {

  private listeners: Listener[];
  private normalizedKeys: NormalizedKeys;
  private zone: NgZone;

  constructor(zone: NgZone) {

    this.zone = zone;
    this.listeners = [];
    this.normalizedKeys = Object.create( null );
    this.zone.runOutsideAngular( (): void => {
      window.addEventListener( 'keydown', this.handleKeyboardEvent );
    });
  }

  listen( bindings: Bindings, options: ListenerOptions ): Unlisten {

    const listener = this.addListener({
      priority: options.priority,
      terminal: this.normalizeTerminal( options.terminal ),
      terminalWhitelist: this.normalizeTerminalWhitelist( options.terminalWhitelist ),
      inputs: this.normalizeInputs( options.inputs ),
      bindings: this.normalizeBindings( bindings )
    });
    const unlisten = (): void => { this.removeListener( listener ); };
    return( unlisten );
  }

  private addListener( listener: Listener ): Listener {

    this.listeners.push( listener );
    this.listeners.sort(
        ( a: Listener, b: Listener ): number => {
          if ( a.priority < b.priority ) {
            return( 1 );
          } else if ( a.priority > b.priority ) {
            // return -1 as a false if a has  bigger priority then b
            // tslint:disable-next-line: no-magic-numbers
            return( -1 );
          } else {
            return( 0 );
          }
      }
    );
    return( listener );

  }

  private getKeyFromEvent( event: KeyboardEvent ): string {
    // If the event key is private
    // tslint:disable-next-line: no-string-literal
    let key = ( event.key || event['key'] || 'Unidentified' );

    if ( key.startsWith( 'U+' ) ) {
      key = String.fromCharCode( parseInt( key.slice( 2 ), 16 ) );
    }
    const parts = [ KEY_MAP[key] || key ];
    if ( event.altKey ) { parts.push( 'Alt' ); }
    if ( event.ctrlKey ) { parts.push( 'Control' ); }
    if ( event.metaKey ) { parts.push( 'Meta' ); }
    if ( event.shiftKey ) { parts.push( 'Shift' ); }
    return( this.normalizeKey( parts.join( '.' ) ) );
  }

  private handleKeyboardEvent = ( event: KeyboardEvent ): void => {

    const key = this.getKeyFromEvent( event );
    const isInputEvent = this.isEventFromInput( event );
    let handler: Handler;
    for ( const listener of this.listeners ) {
      handler = listener.bindings[ key ];
      if ( handler ) {
        if ( ! isInputEvent || listener.inputs ) {
          const result = this.zone.runGuarded(
            (): boolean | void => {
              return( handler( event ) );
            }
          );
          if ( !result ) {
            return;
          } else if ( result ) {
            continue;
          }
        }
        if ( listener.terminal === 'match' ) {
          return;
        }
      }
      if ( ( listener.terminal ) && ! listener.terminalWhitelist[ key ] ) {
        return;
      }
    }
  }

  private isEventFromInput( event: KeyboardEvent ): boolean {

    if ( event.target instanceof Node ) {

      switch ( event.target.nodeName ) {
        case 'INPUT':
        case 'SELECT':
        case 'TEXTAREA':
          return( true );
      }

    }
    return( false );
  }

  private normalizeBindings( bindings: Bindings ): Bindings {

    const normalized = Object.create( null );
    // tslint:disable-next-line: forin
    for ( const key in bindings ) {
      normalized[ this.normalizeKey( key ) ] = bindings[ key ];
    }
    return( normalized );
  }

  private normalizeInputs( inputs: boolean | undefined ): boolean {

    if ( inputs === undefined ) {
      return( false );
    }
    return( inputs );
  }

  private normalizeKey( key: string ): string {

    if ( ! this.normalizedKeys[ key ] ) {
      this.normalizedKeys[ key ] = key
        .toLowerCase()
        .split( '.' )
        .map(
          ( segment ): string => {
            return( KEY_ALIAS[ segment ] || segment );
          }
        )
        .sort()
        .join( '.' );
    }
    return( this.normalizedKeys[ key ] );
  }

  private normalizeTerminal( terminal: Terminal | undefined ): Terminal {

    if ( terminal === undefined ) {
      return( true );
    }
    return( terminal );
  }

  private normalizeTerminalWhitelist( keys: string[] | undefined ): TerminalWhitelist {

    const normalized = Object.create( null );
    if ( keys ) {
      for ( const key of keys ) {
        normalized[ this.normalizeKey( key ) ] = true;
      }
    }
    return( normalized );
  }

  private removeListener( listenerToRemove: Listener ): void {
    this.listeners = this.listeners.filter(( listener: Listener ): boolean => ( listener !== listenerToRemove ));
  }
}
