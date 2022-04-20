import { getOAS } from './config.js'
import { promises as fs } from 'fs'
import { deepStrictEqual } from 'assert';

let spec = await getOAS();

let componentSchemas = {
    '$schema': 'http://json-schema.org/draft-07/schema#',
    title: 'Amplify Central',
    oneOf: [],
    components: {
        schemas: spec.components.schemas
    }
};

// Need to 'fix' them
for (let schemaKey in componentSchemas.components.schemas) {
    const schema = componentSchemas.components.schemas[schemaKey];
    if (!schema['x-axway-kind']) {
        continue;
    }

    schema.properties.apiVersion.enum = [schema.properties.apiVersion.default];
    schema.properties.apiVersion.readOnly = false;
    schema.properties.group.enum = [schema.properties.group.default];
    schema.properties.group.readOnly = false;
    schema.properties.kind.enum = [schema.properties.kind.default];
    schema.properties.kind.readOnly = false;

    schema.required.push('kind', 'apiVersion', 'group');
    if (schema['x-axway-scoped']) {
        schema.required.push('metadata');
    }

    // TODO: HANDLE MULTIPLE SCOPES
    componentSchemas.oneOf.push({
        'title': `${schema['x-axway-kind']}`,
        '$ref': `#/components/schemas/${schemaKey}`
    });
}

await fs.writeFile('central.json', JSON.stringify(componentSchemas, null, 4));