using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using DotNetEnv;
using HealthChecks.SqlServer;
using HealthChecks.UI.Client;
using Mapster;
using Medallion.Threading;
using Medallion.Threading.SqlServer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Pims.Api.Handlers;
using Pims.Api.Helpers;
using Pims.Api.Helpers.Healthchecks;
using Pims.Api.Helpers.HealthChecks;
using Pims.Api.Helpers.Mapping;
using Pims.Api.Helpers.Middleware;
using Pims.Api.Models.Config;
using Pims.Api.Repositories.Cdogs;
using Pims.Api.Repositories.Mayan;
using Pims.Api.Services;
using Pims.Api.Services.Interfaces;
using Pims.Av;
using Pims.Core.Api.Exceptions;
using Pims.Core.Api.Helpers;
using Pims.Core.Api.Middleware;
using Pims.Core.Configuration;
using Pims.Core.Converters;
using Pims.Core.Http;
using Pims.Core.Json;
using Pims.Dal;
using Pims.Dal.Keycloak;
using Pims.Dal.Repositories;
using Pims.Geocoder;
using Pims.Ltsa;
using Polly;
using Prometheus;

namespace Pims.Api
{
    /// <summary>
    /// Startup class, provides a way to startup the .netcore REST API and configure it.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class Startup
    {
        private const string SYSTEMCHECK = "system-check";
        private const string SERVICES = "services";
        private const string EXTERNAL = "external";
        private const string SYSTEM = "system";

        #region Properties

        /// <summary>
        /// get - The application configuration settings.
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// get/set - The environment settings for the application.
        /// </summary>
        public IWebHostEnvironment Environment { get; }
        #endregion

        #region Constructors

        /// <summary>
        /// Creates a new instances of a Startup class.
        /// </summary>
        /// <param name="configuration"></param>
        /// <param name="env"></param>
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            this.Configuration = configuration;
            this.Environment = env;
        }
        #endregion

        #region Methods

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSerilogging(this.Configuration);
            var jsonSerializerOptions = this.Configuration.GenerateJsonSerializerOptions();
            var pimsOptions = this.Configuration.GeneratePimsOptions();

            services.AddMapster(jsonSerializerOptions, pimsOptions, options =>
            {
                options.Default.IgnoreNonMapped(true);
                options.Default.IgnoreNullValues(true);
                options.AllowImplicitDestinationInheritance = true;
                options.AllowImplicitSourceInheritance = true;
                options.Default.PreserveReference(true);
                options.Default.UseDestinationValue(member =>
                    member.SetterModifier == AccessModifier.None &&
                    member.Type.IsGenericType &&
                    member.Type.GetGenericTypeDefinition() == typeof(ICollection<>));
            });
            services.Configure<JsonSerializerOptions>(options =>
            {
                options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                options.DefaultIgnoreCondition = jsonSerializerOptions.DefaultIgnoreCondition;
                options.PropertyNameCaseInsensitive = jsonSerializerOptions.PropertyNameCaseInsensitive;
                options.PropertyNamingPolicy = jsonSerializerOptions.PropertyNamingPolicy;
                options.WriteIndented = jsonSerializerOptions.WriteIndented;
                options.Converters.Add(new JsonStringEnumMemberConverter());
                options.Converters.Add(new Int32ToStringJsonConverter());
                options.Converters.Add(new NetTopologySuite.IO.Converters.GeoJsonConverterFactory());
            });
            services.Configure<Core.Http.Configuration.AuthClientOptions>(this.Configuration.GetSection("Keycloak"));
            services.Configure<Core.Http.Configuration.OpenIdConnectOptions>(this.Configuration.GetSection("OpenIdConnect"));
            services.Configure<Keycloak.Configuration.KeycloakOptions>(this.Configuration.GetSection("Keycloak"));
            services.Configure<Pims.Dal.PimsOptions>(this.Configuration.GetSection("Pims"));
            services.Configure<AllHealthCheckOptions>(this.Configuration.GetSection("HealthChecks"));
            services.AddOptions();

            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.DefaultIgnoreCondition = jsonSerializerOptions.DefaultIgnoreCondition;
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = jsonSerializerOptions.PropertyNameCaseInsensitive;
                    options.JsonSerializerOptions.PropertyNamingPolicy = jsonSerializerOptions.PropertyNamingPolicy;
                    options.JsonSerializerOptions.WriteIndented = jsonSerializerOptions.WriteIndented;
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.Converters.Add(new Int32ToStringJsonConverter());
                    options.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter());
                    options.JsonSerializerOptions.Converters.Add(new NetTopologySuite.IO.Converters.GeoJsonConverterFactory());
                });

            services.AddMvcCore()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.DefaultIgnoreCondition = jsonSerializerOptions.DefaultIgnoreCondition;
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = jsonSerializerOptions.PropertyNameCaseInsensitive;
                    options.JsonSerializerOptions.PropertyNamingPolicy = jsonSerializerOptions.PropertyNamingPolicy;
                    options.JsonSerializerOptions.WriteIndented = jsonSerializerOptions.WriteIndented;
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.Converters.Add(new Int32ToStringJsonConverter());
                    options.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter());
                    options.JsonSerializerOptions.Converters.Add(new NetTopologySuite.IO.Converters.GeoJsonConverterFactory());
                });

            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    var key = Encoding.ASCII.GetBytes(Env.GetString("Keycloak__Secret"));
                    options.RequireHttpsMetadata = false;
                    options.Authority = Configuration["OpenIdConnect:Authority"];
                    options.Audience = Configuration["Keycloak:Audience"];
                    options.SaveToken = true;
                    options.UseSecurityTokenValidators = true;
                    options.MapInboundClaims = false;
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
                    {
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = true,
                        ValidAudiences = new List<string> { Configuration["Keycloak:ValidAudience"] },
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidAlgorithms = new List<string>() { "RS256" },
                    };
                    if (key.Length > 0)
                    {
                        options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(key);
                    }

                    options.Events = new JwtBearerEvents()
                    {
                        OnTokenValidated = context =>
                        {
                            return Task.CompletedTask;
                        },
                        OnAuthenticationFailed = context =>
                        {
                            context.NoResult();
                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            throw new AuthenticationException("Failed to authenticate", context.Exception);
                        },
                        OnForbidden = context =>
                        {
                            return Task.CompletedTask;
                        },
                    };
                });

            // Generate the database connection string.
            var csBuilder = new SqlConnectionStringBuilder(this.Configuration.GetConnectionString("PIMS"));
            var pwd = this.Configuration["DB_PASSWORD"];
            if (!string.IsNullOrEmpty(pwd))
            {
                csBuilder.Password = pwd;
            }

            services.AddHttpClient();
            services.AddTransient<LoggingHandler>();
            services.AddHttpClient("Pims.Api.Logging").AddHttpMessageHandler<LoggingHandler>();
            services.AddPimsContext(this.Environment, csBuilder.ConnectionString);
            services.AddPimsDalRepositories();
            services.AddSingleton<IDistributedLockProvider>(new SqlDistributedSynchronizationProvider(csBuilder.ConnectionString));
            AddPimsApiRepositories(services);
            AddPimsApiServices(services);
            services.AddPimsKeycloakService();
            services.AddGeocoderService(this.Configuration.GetSection("Geocoder"));
            services.AddLtsaService(this.Configuration.GetSection("Ltsa"));
            services.AddClamAvService(this.Configuration.GetSection("Av"));
            services.AddHttpContextAccessor();

            services.AddTransient<ClaimsPrincipal>(s => s.GetService<IHttpContextAccessor>()?.HttpContext?.User);
            services.AddScoped<IProxyRequestClient, ProxyRequestClient>();
            services.AddScoped<IOpenIdConnectRequestClient, OpenIdConnectRequestClient>();
            services.AddResponseCaching();
            services.AddMemoryCache();
            int maxFileSize = int.Parse(this.Configuration.GetSection("Av")?["MaxFileSize"], CultureInfo.InvariantCulture);
            services.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = maxFileSize;
                x.MultipartBodyLengthLimit = maxFileSize; // In case of multipart
            });

            PollyOptions pollyOptions = new();
            this.Configuration.GetSection("Polly").Bind(pollyOptions);

            services.AddResiliencePipeline<string, HttpResponseMessage>(HttpRequestClient.NetworkPolicyName, (builder) =>
            {
                builder.AddRetry(new()
                {
                    BackoffType = DelayBackoffType.Exponential,
                    Delay = TimeSpan.FromSeconds(pollyOptions.DelayInSeconds),
                    MaxRetryAttempts = pollyOptions.MaxRetries,
                    ShouldHandle = new PredicateBuilder<HttpResponseMessage>().Handle<HttpRequestException>().HandleResult(response => (int)response.StatusCode >= 500 && (int)response.StatusCode <= 599),
                });
            });

            // Export metrics from all HTTP clients registered in services
            services.UseHttpClientMetrics();

            var allHealthCheckOptions = new AllHealthCheckOptions();
            Configuration.GetSection("HealthChecks").Bind(allHealthCheckOptions);
            services.AddHealthChecks().ForwardToPrometheus();

            if (allHealthCheckOptions.SqlServer.Enabled)
            {
                services.AddHealthChecks()
                    .Add(new HealthCheckRegistration(
                        "SqlServer",
                        sp =>
                        {
                            var options = new SqlServerHealthCheckOptions
                            {
                                ConnectionString = csBuilder.ConnectionString,
                                CommandText = "SELECT 1;",
                                Configure = null,
                            };
                            return new SqlServerHealthCheck(options);
                        },
                        default,
                        new[] { SERVICES })
                    { Period = TimeSpan.FromMinutes(allHealthCheckOptions.SqlServer.Period) });
            }

            if (allHealthCheckOptions.PimsDBCollation.Enabled)
            {
                services.AddHealthChecks().Add(new HealthCheckRegistration(
                    "PimsDBCollation",
                    sp => new PimsDatabaseHealthcheck(csBuilder.ConnectionString),
                    default,
                    new string[] { SERVICES })
                { Period = TimeSpan.FromMinutes(allHealthCheckOptions.PimsDBCollation.Period) });
            }

            if (allHealthCheckOptions.ApiMetrics.Enabled)
            {
                services.AddHealthChecks().Add(new HealthCheckRegistration(
                    "ApiMetrics",
                    sp => new PimsMetricsHealthcheck(csBuilder.ConnectionString),
                    HealthStatus.Unhealthy,
                    new string[] { SERVICES })
                { Period = TimeSpan.FromMinutes(allHealthCheckOptions.ApiMetrics.Period) });
            }

            if (allHealthCheckOptions.PmbcExternalApi.Enabled)
            {
                services.AddHealthChecks().Add(new HealthCheckRegistration(
                    "PmbcExternalApi",
                    sp => new PimsExternalApiHealthcheck(this.Configuration.GetSection("HealthChecks:PmbcExternalApi")),
                    null,
                    new string[] { SERVICES, EXTERNAL, SYSTEMCHECK })
                { Period = TimeSpan.FromMinutes(allHealthCheckOptions.PmbcExternalApi.Period) });
            }

            if (allHealthCheckOptions.Geoserver.Enabled)
            {
                services.AddHealthChecks().Add(new HealthCheckRegistration(
                    "Geoserver",
                    sp => new PimsGeoserverHealthCheck(this.Configuration),
                    null,
                    new string[] { SERVICES, SYSTEM, SYSTEMCHECK })
                { Period = TimeSpan.FromMinutes(allHealthCheckOptions.Geoserver.Period) });
            }

            if (allHealthCheckOptions.Mayan.Enabled)
            {
                services.AddHealthChecks().Add(new HealthCheckRegistration(
                    "Mayan",
                    sp => new PimsMayanHealthcheck(sp.GetService<IEdmsDocumentRepository>()),
                    null,
                    new string[] { SERVICES, SYSTEMCHECK })
                { Period = TimeSpan.FromMinutes(allHealthCheckOptions.Mayan.Period) });
            }

            if (allHealthCheckOptions.Ltsa.Enabled)
            {
                services.AddHealthChecks().Add(new HealthCheckRegistration(
                    "Ltsa",
                    sp => new PimsLtsaHealthcheck(allHealthCheckOptions.Ltsa, sp.GetService<ILtsaService>()),
                    null,
                    new string[] { SERVICES, EXTERNAL, SYSTEMCHECK })
                { Period = TimeSpan.FromMinutes(allHealthCheckOptions.Ltsa.Period) });
            }

            if (allHealthCheckOptions.Geocoder.Enabled)
            {
                services.AddHealthChecks().Add(new HealthCheckRegistration(
                    "Geocoder",
                    sp => new PimsGeocoderHealthcheck(this.Configuration, sp.GetService<IGeocoderService>()),
                    null,
                    new string[] { SERVICES, EXTERNAL, SYSTEMCHECK })
                { Period = TimeSpan.FromMinutes(allHealthCheckOptions.Geocoder.Period) });
            }

            if (allHealthCheckOptions.Cdogs.Enabled)
            {
                services.AddHealthChecks().Add(new HealthCheckRegistration(
                    "Cdogs",
                    sp => new PimsCdogsHealthcheck(sp.GetService<IDocumentGenerationRepository>()),
                    null,
                    new string[] { SERVICES, EXTERNAL, SYSTEMCHECK })
                { Period = TimeSpan.FromMinutes(allHealthCheckOptions.Cdogs.Period) });
            }

            services.AddApiVersioning(options =>
            {
                options.ReportApiVersions = true;
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ApiVersionReader = new HeaderApiVersionReader("api-version");
            });
            services.AddVersionedApiExplorer(options =>
            {
                // add the versioned api explorer, which also adds IApiVersionDescriptionProvider service
                // note: the specified format code will format the version as "'v'major[.minor][-status]"
                options.GroupNameFormat = "'v'VVV";

                // note: this option is only necessary when versioning by url segment. the SubstitutionFormat
                // can also be used to control the format of the API version in route templates
                options.SubstituteApiVersionInUrl = true;
            });

            services.Configure<OpenApiInfo>(Configuration.GetSection(nameof(OpenApiInfo)));
            services.AddMultiVersionToSwagger();
            services.AddSwaggerGen(options =>
            {
                options.EnableAnnotations(false, true);
                options.CustomSchemaIds(o => o.FullName);
                options.OperationFilter<SwaggerDefaultValues>();
                options.DocumentFilter<Helpers.Swagger.SwaggerDocumentFilter>();
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Description = "Please enter into field the word 'Bearer' following by space and JWT",
                    Type = SecuritySchemeType.ApiKey,
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer",
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    },
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);
            });

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.All;
                options.AllowedHosts = this.Configuration.GetValue<string>("AllowedHosts")?.Split(';').ToList<string>();
            });
            services.AddDatabaseDeveloperPageExceptionFilter();
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        /// <param name="provider"></param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            app.UseMetricServer();
            app.UseHttpMetrics();

            if (!env.IsProduction())
            {
                app.UseDeveloperExceptionPage();
            }

            var baseUrl = this.Configuration.GetValue<string>("BaseUrl");
            app.UsePathBase(baseUrl);
            app.UseForwardedHeaders();

            app.UseSwagger(options =>
            {
                options.RouteTemplate = this.Configuration.GetValue<string>("Swagger:RouteTemplate");
            }).ConfigureSwaggerUI(provider);
            app.UseSwaggerUI(options =>
            {
                foreach (var description in provider.ApiVersionDescriptions)
                {
                    options.SwaggerEndpoint(string.Format(CultureInfo.InvariantCulture, this.Configuration.GetValue<string>("Swagger:EndpointPath"), description.GroupName), description.GroupName);
                }
                options.RoutePrefix = this.Configuration.GetValue<string>("Swagger:RoutePrefix");
            });

            app.UseMiddleware<ResponseTimeMiddleware>();
            app.UseMiddleware<LogRequestMiddleware>();
            app.UseMiddleware<LogResponseMiddleware>();

            app.UseRouting();
            app.UseCors();

            // Exception handler middleware that changes HTTP response codes must be registered after UseHttpMetrics()
            // in order to ensure that prometheus-net reports the correct HTTP response status code.
            app.UseHttpMetrics();
            app.UseMiddleware<ErrorHandlingMiddleware>();

            // Set responses secure headers.
            ConfigureSecureHeaders(app, Configuration);

            app.UseResponseCaching();

            app.UseAuthentication();
            app.UseAuthorization();

            var healthPort = this.Configuration.GetValue<int>("HealthChecks:Port");
            app.UseHealthChecks(this.Configuration.GetValue<string>("HealthChecks:LivePath"), healthPort, new HealthCheckOptions
            {
                Predicate = r => r.Name.Contains("SqlServer"),
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
            });
            app.UseHealthChecks(this.Configuration.GetValue<string>("HealthChecks:ReadyPath"), healthPort, new HealthCheckOptions
            {
                Predicate = r => r.Tags.Contains("services") && !r.Tags.Contains("external"),
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
            });

            app.UseEndpoints(config =>
            {
                config.MapControllers();
                config.MapHealthChecks("health/system", new HealthCheckOptions()
                {
                    Predicate = r => r.Tags.Contains("system-check"),
                    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
                });

                // Enable the /metrics page to export Prometheus metrics
                config.MapMetrics();
            });
        }

        private static void AddPimsApiRepositories(IServiceCollection services)
        {
            services.AddSingleton<IEdmsAuthRepository, MayanAuthRepository>();
            services.AddScoped<IEdmsDocumentRepository, MayanDocumentRepository>();
            services.AddScoped<IEdmsMetadataRepository, MayanMetadataRepository>();
            services.AddScoped<IDocumentGenerationRepository, CdogsRepository>();
            services.AddScoped<IDocumentQueueRepository, DocumentQueueRepository>();
            services.AddSingleton<IDocumentGenerationAuthRepository, CdogsAuthRepository>();
        }

        /// <summary>
        /// Add PimsService objects to the dependency injection service collection.
        /// </summary>
        /// <param name="services"></param>
        private static void AddPimsApiServices(IServiceCollection services)
        {
            services.AddScoped<IDocumentService, DocumentService>();
            services.AddScoped<IDocumentSyncService, DocumentSyncService>();
            services.AddScoped<INoteService, NoteService>();
            services.AddScoped<IAcquisitionFileService, AcquisitionFileService>();
            services.AddScoped<ILeaseService, LeaseService>();
            services.AddScoped<ILeaseReportsService, LeaseReportsService>();
            services.AddScoped<ILeasePeriodService, LeasePeriodService>();
            services.AddScoped<ILeasePaymentService, LeasePaymentService>();
            services.AddScoped<ISecurityDepositService, SecurityDepositService>();
            services.AddScoped<ISecurityDepositReturnService, SecurityDepositReturnService>();
            services.AddScoped<IPersonService, PersonService>();
            services.AddScoped<IOrganizationService, OrganizationService>();
            services.AddScoped<IResearchFileService, ResearchFileService>();
            services.AddScoped<IPropertyService, PropertyService>();
            services.AddScoped<ICoordinateTransformService, CoordinateTransformService>();
            services.AddScoped<IDocumentGenerationService, DocumentGenerationService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IFinancialCodeService, FinancialCodeService>();
            services.AddScoped<IDocumentFileService, DocumentFileService>();
            services.AddScoped<ITakeService, TakeService>();
            services.AddScoped<IFormDocumentService, FormDocumentService>();
            services.AddScoped<ICompensationRequisitionService, CompensationRequisitionService>();
            services.AddScoped<ICompReqFinancialService, CompReqFinancialService>();
            services.AddScoped<IH120CategoryService, H120CategoryService>();
            services.AddScoped<IContactService, ContactService>();
            services.AddScoped<IExpropriationPaymentService, ExpropriationPaymentService>();
            services.AddScoped<IAcquisitionStatusSolver, AcquisitionStatusSolver>();
            services.AddScoped<IDispositionFileService, DispositionFileService>();
            services.AddScoped<IDispositionStatusSolver, DispositionStatusSolver>();
            services.AddScoped<ILeaseStatusSolver, LeaseStatusSolver>();
            services.AddScoped<IPropertyOperationService, PropertyOperationService>();
            services.AddScoped<ITakeInteractionSolver, TakeInteractionSolver>();
            services.AddScoped<IDocumentQueueService, DocumentQueueService>();
            services.AddScoped<IEnvironmentService, EnvironmentService>();
            services.AddScoped<IDocumentQueueService, DocumentQueueService>();
            services.AddScoped<IResearchStatusSolver, ResearchStatusSolver>();
            services.AddScoped<IBctfaOwnershipService, BctfaOwnershipService>();
            services.AddScoped<IExpropriationEventService, ExpropriationEventService>();
            services.AddScoped<IManagementFileService, ManagementFileService>();
            services.AddScoped<IManagementActivityService, ManagementActivityService>();
            services.AddScoped<IManagementFileStatusSolver, ManagementFileStatusSolver>();
        }

        /// <summary>
        /// Configures the app to to use content security policies.
        /// </summary>
        /// <param name="app">The application builder provider.</param>
        /// <param name="configuration">The configuration to use.</param>
        private static void ConfigureSecureHeaders(IApplicationBuilder app, IConfiguration configuration)
        {
            ContentSecurityPolicyConfig cspConfig = new();
            configuration.GetSection("ContentSecurityPolicy").Bind(cspConfig);
            string csp = cspConfig.GenerateCSPString();
            app.Use(
                async (context, next) =>
                {
                    context.Response.Headers.Append("Content-Security-Policy", csp);
                    await next().ConfigureAwait(true);
                });

            app.Use(
            async (context, next) =>
            {
                context.Response.Headers.Append("Strict-Transport-Security", "max-age=86400; includeSubDomains");
                context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Append("X-XSS-Protection", "1");
                context.Response.Headers.Append("X-Frame-Options", " DENY");
                await next().ConfigureAwait(true);
            });
        }
        #endregion
    }
}
