import nunjucks from "nunjucks";

// Configure the environment to trim whitespace.
const env = nunjucks.configure({ trimBlocks: true, lstripBlocks: true });

// Define the template source.
const src = `
{% for type in definitions %}
{{ indent }} Parameters

{% for propertyName, property in type.definition.properties | dictsort %}
{{ indent }}# \`{{ propertyName }}\` _({{ property.type }}{% if property.enum %}, enum{% endif %})_

{{ property.description | replace("\\n", " ") }}

{% if property.enum -%}
Possible enum values for \`{{ propertyName }}\`:

{% for value in property.enum -%}
- \`{{ value }}\`
{% endfor %}
{%- endif %}

{%- if property.properties %}
{{ indent }}## Attributes

{% for subPropertyName, subProperty in property.properties | dictsort %}
- \`{{ propertyName }}.{{ subPropertyName }}\` _({{ subProperty.type }}{% if subProperty.enum %}, enum{% endif %})_ - {{ subProperty.description | replace("\\n", " ") }}{% if subProperty.enum %} Possible enum values:
{% for value in subProperty.enum %}
  - \`{{ value }}\`
{% endfor %}{% endif %}

{% endfor %}
{% endif %}

{% endfor %}
{% endfor %}
`;

// Compile the template.
const template = nunjucks.compile(src, env);

export default template;
