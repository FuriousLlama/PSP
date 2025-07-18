using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Core.Api.Policies;
using Pims.Core.Extensions;
using Pims.Core.Helpers;
using Pims.Core.Security;
using Pims.Ltsa;
using Swashbuckle.AspNetCore.Annotations;
using Model = Pims.Ltsa.Models;

namespace Pims.Api.Areas.Tools.Controllers
{
    /// <summary>
    /// LtsaController class, provides endpoints to integrate with Ltsa.
    /// </summary>
    [Authorize]
    [ApiController]
    [Area("tools")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/ltsa")]
    [Route("[area]/ltsa")]
    public class LtsaController : ControllerBase
    {
        #region Variables
        private readonly ILtsaService _ltsaService;
        private readonly ILogger _logger;
        private readonly ClaimsPrincipal _user;
        #endregion

        #region Constructors

        /// <summary>
        /// Creates a new instance of a LtsaController class.
        /// </summary>
        /// <param name="ltsaService"></param>
        /// <param name="logger"></param>
        /// <param name="user"></param>
        public LtsaController(ILtsaService ltsaService, ILogger<LtsaController> logger, ClaimsPrincipal user)
        {
            _ltsaService = ltsaService;
            _logger = logger;
            _user = user;
        }
        #endregion

        #region Endpoints

        /// <summary>
        /// Make a request to Ltsa for title summaries that match the specified `search`.
        /// </summary>
        /// <param name="pid">the parcel identifier to search for.</param>
        /// <returns>An array of title summary matches.</returns>
        [HttpGet("summaries")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.TitleSummariesResponse), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-ltsa" })]
        [HasPermission(Permissions.PropertyEdit)]
        public async Task<IActionResult> FindTitleSummariesAsync(string pid)
        {
            _logger.LogInformation(
                "Request received by Controller: {Controller}, Action: {ControllerAction}, User: {User}, DateTime: {DateTime}",
                nameof(LtsaController),
                nameof(FindTitleSummariesAsync),
                _user.GetUsername(),
                DateTime.Now);

            if (string.IsNullOrEmpty(pid) || PidTranslator.ConvertPID(pid) == 0)
            {
                throw new BadHttpRequestException("The pid of the desired property must be specified");
            }

            var result = await _ltsaService.GetTitleSummariesAsync(PidTranslator.ConvertPID(pid));
            return new JsonResult(result.TitleSummaries);
        }

        /// <summary>
        /// Post a new order using default parameters and the passed in titleNumber.
        /// </summary>
        /// <param name="titleNumber">the title number to create the order for.</param>
        /// <param name="landTitleDistrictCode">the land title district code.</param>
        /// <returns>The order created within LTSA.</returns>
        [HttpPost("order/title")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.OrderWrapper<Model.TitleOrder>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-ltsa" })]
        [HasPermission(Permissions.PropertyView)]
        public async Task<IActionResult> PostTitleOrderAsync(string titleNumber, string landTitleDistrictCode)
        {
            _logger.LogInformation(
                "Request received by Controller: {Controller}, Action: {ControllerAction}, User: {User}, DateTime: {DateTime}",
                nameof(LtsaController),
                nameof(PostTitleOrderAsync),
                _user.GetUsername(),
                DateTime.Now);

            var result = await _ltsaService.PostTitleOrder(titleNumber, landTitleDistrictCode);
            return new JsonResult(result?.Order);
        }

        /// <summary>
        /// Post a new order using default parameters and the passed in titleNumber.
        /// </summary>
        /// <param name="pid">the pid to create the order for.</param>
        /// <returns>The order created within LTSA.</returns>
        [HttpPost("order/parcelInfo")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.OrderWrapper<Model.ParcelInfoOrder>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-ltsa" })]
        [HasPermission(Permissions.PropertyView)]
        public async Task<IActionResult> PostParcelInfoOrderAsync(string pid)
        {
            _logger.LogInformation(
                "Request received by Controller: {Controller}, Action: {ControllerAction}, User: {User}, DateTime: {DateTime}",
                nameof(LtsaController),
                nameof(PostParcelInfoOrderAsync),
                _user.GetUsername(),
                DateTime.Now);

            if (string.IsNullOrEmpty(pid) || PidTranslator.ConvertPID(pid) == 0)
            {
                throw new BadHttpRequestException("The pid of the desired property must be specified");
            }
            var result = await _ltsaService.PostParcelInfoOrder(PidTranslator.ConvertPIDToDash(pid));
            return new JsonResult(result?.Order);
        }

        /// <summary>
        /// Post a new order using default parameters and the passed in strataPlanNumber.
        /// </summary>
        /// <param name="strataPlanNumber">the title number to create the order for.</param>
        /// <returns>The order created within LTSA.</returns>
        [HttpPost("order/spcp")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.OrderWrapper<Model.SpcpOrder>), 200)]
        [ProducesResponseType(typeof(Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-ltsa" })]
        [HasPermission(Permissions.PropertyView)]
        public async Task<IActionResult> PostSpcpOrderAsync([FromQuery]string strataPlanNumber)
        {
            _logger.LogInformation(
                "Request received by Controller: {Controller}, Action: {ControllerAction}, User: {User}, DateTime: {DateTime}",
                nameof(LtsaController),
                nameof(PostSpcpOrderAsync),
                _user.GetUsername(),
                DateTime.Now);

            var result = await _ltsaService.PostSpcpOrder(strataPlanNumber);

            return new JsonResult(result?.Order);
        }

        /// <summary>
        /// Get title and parcel information from LTSA by posting a title and parcel info order.
        /// </summary>
        /// <param name="pid">the pid to retrieve parcel and title information for.</param>
        /// <returns>The orders created within LTSA.</returns>
        [HttpPost("all")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.LtsaOrders>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-ltsa" })]
        [HasPermission(Permissions.PropertyView)]
        public async Task<IActionResult> PostLtsaFields(string pid)
        {
            _logger.LogInformation(
                "Request received by Controller: {Controller}, Action: {ControllerAction}, User: {User}, DateTime: {DateTime}",
                nameof(LtsaController),
                nameof(PostLtsaFields),
                _user.GetUsername(),
                DateTime.Now);

            if (string.IsNullOrEmpty(pid) || PidTranslator.ConvertPID(pid) == 0)
            {
                throw new BadHttpRequestException("The pid of the desired property must be specified");
            }

            var result = await _ltsaService.PostLtsaFields(pid);
            return new JsonResult(result);
        }
        #endregion
    }
}
