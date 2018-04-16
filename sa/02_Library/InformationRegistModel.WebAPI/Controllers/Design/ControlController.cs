using LeadingCloud.Framework.Web;
using LeadingCloud.MISPT.InformationRegistModel.Design;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.Framework.Common.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;

namespace LeadingCloud.MISPT.InformationRegistModel.WebAPI.Controllers.Design
{
    /// <summary>
    /// 控件操作相关API
    /// </summary>
    public class ControlController : ApiController
    {

        /// <summary>
        /// 保存控件
        /// </summary>
        /// <param name="data">要保存的数据</param>
        /// <param name="sc">上下文服务</param>
        /// <returns>保存成功配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Control/Save/{tokenid}")]
        [HttpPost]
        public ResponseBag<ControlEntity> Save([FromBody]ControlEntity model, String tokenId)
        {
            Func<StringBag, ControlEntity> func = (StringBag bag) =>
            {
                return ControlManager.Instance.Save(model, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<ControlEntity>(func, tokenId, "328600", null);
        }

        /// <summary>
        /// 删除控件
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="tokenId">令牌</param>
        /// <returns>成功返回true；否则返回false</returns>
        [Route("api/" + Const.AppCode + "/Control/Delete/{id}/{tokenid}")]
        [HttpGet]
        public ResponseBag<bool> Delete(String id, String tokenId)
        {
            Func<StringBag, bool> func = (StringBag bag) =>
            {
                return ControlManager.Instance.Delete(id, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<bool>(func, tokenId, "328601", false);
        }

        /// <summary>
        ///  获取控件
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Control/Load/{id}/{tokenid}")]
        [HttpGet]
        public ResponseBag<ControlEntity> GetControl(String id, String tokenId)
        {
            Func<StringBag, ControlEntity> func = (StringBag bag) =>
               {
                   return ControlManager.Instance.GetControl(id, bag.RequestContext);
               };
            return ApiControllerHelper.CallFunc<ControlEntity>(func, tokenId, "328602", null);
        }

        /// <summary>
        ///  获取控件列表(根据人员)
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Control/GetList/{tokenid}")]
        [HttpGet]
        public ResponseBag<List<ControlEntity>> GetControlList(String tokenId)
        {
            Func<StringBag, List<ControlEntity>> func = (StringBag bag) =>
               {
                   return ControlManager.Instance.GetUserControlList(bag.RequestContext);
               };
            return ApiControllerHelper.CallFunc<List<ControlEntity>>(func, tokenId, "328603", null);
        }

        /// <summary>
        ///  获取所有控件列表,不区分人员
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Control/GetAllList/{tokenid}")]
        [HttpGet]
        public ResponseBag<List<ControlEntity>> GetAllControlList(String tokenId)
        {
            Func<StringBag, List<ControlEntity>> func = (StringBag bag) =>
               {
                   return ControlManager.Instance.GetControlList(bag.RequestContext);
               };
            return ApiControllerHelper.CallFunc<List<ControlEntity>>(func, tokenId, "328603", null);
        }
        /// <summary>
        ///  根据控件编码批量获取控件
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Control/LoadByCodes/{tokenid}")]
        [HttpPost]
        public ResponseBag<List<ControlEntity>> GetControlsByCode(List<string> codes, String tokenId)
        {
            Func<StringBag, List<ControlEntity>> func = (StringBag bag) =>
               {
                   return ControlManager.Instance.GetControlsByCode(codes, bag.RequestContext);
               };
            return ApiControllerHelper.CallFunc<List<ControlEntity>>(func, tokenId, "328603", null);
        }
    }
}
