/* -*- mode: js; js-basic-offset: 4; indent-tabs-mode: nil -*- */

/*
 * Part of this file comes from gnome-shell-extensions:
 * http://git.gnome.org/browse/gnome-shell-extensions/
 */

const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;

/**
 * getSettings:
 * @schema: (optional): the GSettings schema id
 *
 * Builds and return a GSettings schema for @schema, using schema files
 * in extensionsdir/schemas. If @schema is not provided, it is taken from
 * metadata['settings-schema'].
 */
function getSettings(schema) {
    let UbuntuDock_UUID = 'ubuntu-dock@ubuntu.com';
    let extension = ExtensionUtils.extensions[UbuntuDock_UUID];

    schema = schema || extension.metadata['settings-schema'];

    const GioSSS = Gio.SettingsSchemaSource;

    // Check if this extension was built with "make zip-file", and thus
    // has the schema files in a subfolder
    // otherwise assume that extension has been installed in the
    // same prefix as gnome-shell (and therefore schemas are available
    // in the standard folders)
    let schemaDir = extension.dir.get_child('schemas');
    let schemaSource;
    if (schemaDir.query_exists(null))
        schemaSource = GioSSS.new_from_directory(schemaDir.get_path(),
                                                 GioSSS.get_default(),
                                                 false);
    else
        schemaSource = GioSSS.get_default();

    let schemaObj = schemaSource.lookup(schema, true);
    if (!schemaObj)
        throw new Error('Schema ' + schema + ' could not be found for extension '
                        + extension.metadata.uuid + '. Please check your installation.');

    return new Gio.Settings({
        settings_schema: schemaObj
    });
}
