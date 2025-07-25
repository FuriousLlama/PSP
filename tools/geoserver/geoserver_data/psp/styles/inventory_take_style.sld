<?xml version="1.0" encoding="UTF-8"?>
<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0">
  <sld:NamedLayer>
    <sld:Name>land_act_take_style</sld:Name>
    <sld:UserStyle>
      <sld:Title/>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:Title>default rule</sld:Title>
          <sld:PolygonSymbolizer>
            <sld:Fill>
              <sld:GraphicFill>
                <sld:Graphic>
                  <sld:Mark>
                    <sld:WellKnownName>shape://horline</sld:WellKnownName>
                    <sld:Fill/>
                    <sld:Stroke>
                      <sld:CssParameter name="stroke">#7a0177</sld:CssParameter>
                      <sld:CssParameter name="stroke-width">4</sld:CssParameter>
                    </sld:Stroke>
                  </sld:Mark>
                  <sld:Size>
                    <ogc:Literal>12.0</ogc:Literal>
                  </sld:Size>
                </sld:Graphic>
              </sld:GraphicFill>
              </sld:Fill>
          </sld:PolygonSymbolizer>
          <sld:PolygonSymbolizer>
            <sld:Fill>
              </sld:Fill>
            <sld:Fill>
              <sld:CssParameter name="fill">#7a0177</sld:CssParameter>
              <sld:CssParameter name="fill-opacity">.40</sld:CssParameter>
            </sld:Fill>
            <Stroke>
              <CssParameter name="stroke-opacity">1</CssParameter>
              <CssParameter name="stroke-width">3</CssParameter>
              <CssParameter name="stroke">#7a0177</CssParameter>
            </Stroke>
          </sld:PolygonSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </sld:NamedLayer>
</sld:StyledLayerDescriptor>