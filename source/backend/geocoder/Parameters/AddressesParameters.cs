namespace Pims.Geocoder.Parameters
{
    /// <summary>
    /// <para>
    /// AddressesParameters class, provides a way to pass parameters to the addresses endpoint of BC Address Geocoder.
    /// </para>
    /// See - <see href="https://www2.gov.bc.ca/gov/content/data/geographic-data-services/location-services/geocoder"/>.
    /// </summary>
    public class AddressesParameters : BaseParameters
    {
        #region Properties

        /// <summary>
        /// <para>
        /// get/set - Civic address or intersection address as a single string in Single-line Address Format. If not present in an address request, individual address elements, such as streetName, localityName, and provinceCode must be provided.
        /// In an occupant/addresses resource, addressString represents an Occupant name followed by a frontGate delimiter('--') followed by an optional address.
        /// </para>
        /// <example>
        /// For example:
        /// <code>
        /// 525 Superior Street, Victoria, BC
        /// </code>
        /// </example>
        /// </summary>
        public string AddressString { get; set; }

        /// <summary>
        /// get/set - The maximum number of search results to return.
        /// </summary>
        /// <value>Default value: <c>5</c>.</value>
        public int MaxResults { get; set; } = 5;

        /// <summary>
        /// get/set - In the case of a block level match, the method of interpolation to determine how far down the block the accessPoint should be. The geocoder supports none, linear and adaptive interpolation.
        /// </summary>
        /// <value>Default value: <c>adaptive</c>.</value>
        public string Interpolation { get; set; } = "adaptive";

        /// <summary>
        /// get/set - If <c>true</c>, include unmatched address details such as site name in results.
        /// </summary>
        /// <value>Default value: <c>true</c>.</value>
        public bool Echo { get; set; }

        /// <summary>
        /// get/set - If <c>true</c>, addressString is expected to contain a partial address that requires completion. Not supported for shp, csv, gml formats.
        /// </summary>
        /// <value>Default value: <c>true</c>.</value>
        public bool AutoComplete { get; set; } = true;

        /// <summary>
        /// get/set - If <c>true</c>, autoComplete suggestions are limited to addresses beginning with the provided partial address.
        /// </summary>
        /// <value>Default value: <c>true</c>.</value>
        public bool ExactSpelling { get; set; } = true;

        /// <summary>
        /// get/set - If <c>true</c>, autoComplete suggestions are sorted using a fuzzy match comparison to the addressString.
        /// </summary>
        /// <value>Default value: <c>false</c>.</value>
        public bool FuzzyMatch { get; set; }

        /// <summary>
        /// get/set - The minimum score required for a match to be returned.
        /// </summary>
        /// <value>Default value: <c>1</c>.</value>
        public int MinScore { get; set; }

        /// <summary>
        /// get/set - The maximum distance (in metres) to search from the given point. If not specified, the search distance is unlimited.
        /// </summary>
        public override double? MaxDistance { get; set; } = 0;

        /// <summary>
        /// get/set - The level of precision of an address match. Here are the nine levels from the most precise to least precise:
        /// OCCUPANT – the site occupant name matched
        /// SITE – the site name matched
        /// UNIT – the unit number, unit number suffix, and unit designator matched
        /// CIVIC_NUMBER – the civic number matched
        /// INTERSECTION – the intersection matched
        /// BLOCK – the civic number falls within a known block range
        /// STREET – the street name, street direction, and street type matched
        /// LOCALITY – the locality matched
        /// PROVINCE - no match
        /// When used as an input parameter, matchPrecision is a comma-separated list of matchPrecision levels.Only matches with a matchPrecision in this list will be included in the request results.For example, matchPrecision = STREET will only include street-level matches.
        /// </summary>
        public string MatchPrecision { get; set; }

        /// <summary>
        /// get/set - A comma-separated list of matchPrecision levels to exclude from request results. For example, &matchPrecisionNot=UNIT,SITE will exclude matches at the unit and site levels.
        /// </summary>
        public string MatchPrecisionNot { get; set; }

        /// <summary>
        /// get/set - A string containing the name of a site (e.g., Duck Building, Casa Del Mar, Crystal Garden, Bluebird House). A business name should only be used if it is permanently affixed to the site and the site has no other, more generic name. If a site is a unit within a complex, it may have a sitename in addition to a unitNumber and unitNumberSuffix.
        /// </summary>
        public string SiteName { get; set; }

        /// <summary>
        /// get/set - The type of unit. Examples include APT, BLDG, BSMT, FLR, LOBBY, LWR, PAD, PH, REAR, RM, SIDE, SITE, SUITE, TH, UNIT, UPPR.
        /// </summary>
        public string UnitDesignator { get; set; }

        /// <summary>
        /// get/set - The number of the unit, suite, or apartment within a house or building.
        /// </summary>
        public string UnitNumber { get; set; }

        /// <summary>
        /// get/set - A letter that follows the unit number as in Unit 1A or Suite 302B.
        /// </summary>
        public string UnitNumberSuffix { get; set; }

        /// <summary>
        /// get/set - The official number assigned to a site by an address authority.
        /// </summary>
        public string CivicNumber { get; set; }

        /// <summary>
        /// get/set - A letter or fraction that follows the civic number (e.g., the A in 1039A Bledsoe St).
        /// </summary>
        public string CivicNumberSuffix { get; set; }

        /// <summary>
        /// get/set - The official name of the street as assigned by an address authority (e.g., the Douglas in 1175 Douglas Street).
        /// </summary>
        public string StreetName { get; set; }

        /// <summary>
        /// get/set - The type of street as assigned by a municipality (e.g., the ST in 1175 DOUGLAS St).
        /// </summary>
        public string StreetType { get; set; }

        /// <summary>
        /// get/set - The abbreviated compass direction as defined by Canada Post and B.C. civic addressing authorities.
        /// </summary>
        public string StreetDirection { get; set; }

        /// <summary>
        /// get/set - Example: the Bridge in Johnson St Bridge. The qualifier of a street name.
        /// </summary>
        public string StreetQualifier { get; set; }

        /// <summary>
        /// get/set - The name of the locality assigned to a given site by an address authority.
        /// </summary>
        public string LocalityName { get; set; }

        /// <summary>
        /// get/set - The ISO 3166-2 Sub-Country Code. The code for British Columbia is BC.
        /// </summary>
        /// <value>Default value: <c>BC</c>.</value>
        public string ProvinceCode { get; set; } = "BC";

        /// <summary>
        /// get/set - A comma separated list of locality names that matched addresses must belong to. For example, setting localities to Nanaimo only returns addresses in Nanaimo.
        /// </summary>
        public string Localities { get; set; }

        /// <summary>
        /// get/set - A comma-separated list of localities to exclude from the search.
        /// </summary>
        public string NotLocalities { get; set; }

        /// <summary>
        /// get/set - Example: -126.07929,49.7628,-126.0163,49.7907. A bounding box (xmin,ymin,xmax,ymax) that limits the search area.
        /// </summary>
        public string Bbox { get; set; }

        /// <summary>
        /// get/set - Example: -124.0165926,49.2296251 . The coordinates of a centre point (x,y) used to define a bounding circle that will limit the search area. This parameter must be specified together with 'maxDistance'.
        /// </summary>
        public string Center { get; set; }

        /// <summary>
        /// get/set - If <c>true</c>, uses supplied parcelPoint to derive an appropriate accessPoint.
        /// </summary>
        public bool Extrapolate { get; set; }

        /// <summary>
        /// get/set - The coordinates of a point (x,y) known to be inside the parcel containing a given address.
        /// </summary>
        public string ParcelPoint { get; set; }
        #endregion
    }
}
