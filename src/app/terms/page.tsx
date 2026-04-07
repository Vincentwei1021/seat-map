import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "使用条款 - 座位表生成器",
  description: "座位表生成器的使用条款。",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">使用条款</h1>
      <div className="prose prose-gray text-sm text-gray-600 space-y-4">
        <p>最后更新日期：2026年4月7日</p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">服务说明</h2>
        <p>
          座位表生成器（seat.toolboxlite.com）是一款免费的在线工具，用于帮助教师生成和管理班级座位表。
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">使用条件</h2>
        <p>
          本工具仅供教育用途使用。用户应确保输入的信息合法合规，不得用于任何非法目的。
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">免责声明</h2>
        <p>
          本工具按"现状"提供，不做任何明示或暗示的保证。ToolboxLite 不对使用本工具产生的任何直接或间接损失承担责任。
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">知识产权</h2>
        <p>本网站的设计和代码归 ToolboxLite 所有。用户生成的座位表内容归用户所有。</p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">条款变更</h2>
        <p>ToolboxLite 保留随时修改本使用条款的权利。修改后的条款将在本页面发布。</p>
      </div>
      <div className="mt-8">
        <a href="/" className="text-sm text-teal-600 hover:text-teal-800">
          &larr; 返回座位表生成器
        </a>
      </div>
    </main>
  );
}
